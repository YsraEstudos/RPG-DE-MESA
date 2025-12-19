import { motion } from 'framer-motion'
import { useBodyStore } from '../../store/bodyStore'
import type { BodyPartName } from '../../store/bodyStore'
import { BODY_PARTS_PATHS } from './bodyParts.constants'

const BodyPartGroup = ({
    id,
    paths,
}: {
    id: BodyPartName,
    paths: string[]
}) => {
    const { parts, selectedPart, selectPart } = useBodyStore()
    const status = parts[id]
    const isSelected = selectedPart === id

    // Determine base colors based on status
    const getStatusColors = () => {
        if (status.health <= 0) return { fill: 'fill-stone-800', stroke: 'stroke-stone-600', glow: '' } // Dead/Broken
        if (status.health < 30) return { fill: 'fill-red-900/40', stroke: 'stroke-red-500', glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' } // Critical
        if (status.health < 70) return { fill: 'fill-yellow-900/40', stroke: 'stroke-yellow-500', glow: '' } // Injured
        return { fill: 'fill-[#b0c4de]', stroke: 'stroke-[#4a4a4a]', glow: 'drop-shadow-[0_0_2px_rgba(176,196,222,0.3)]' } // Healthy
    }

    const colors = getStatusColors()

    // Dynamic classes
    const groupClassName = `
        cursor-pointer transition-all duration-300
        ${isSelected ? 'filter drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]' : colors.glow}
    `

    // Path classes
    // We remove individual hover here because we want the group to handle interactions logically, 
    // but applying hover style to individual paths is still fine if we want them to light up together.
    // Actually, framer motion whileHover on Group doesn't auto-pass to children unless variants are used.
    // But we can use CSS group-hover? 
    // Let's stick to simple CSS hover on the path if the group is hovered?
    // "group" class on the g element allows children to use "group-hover".

    const pathClassName = `
        stroke-2 transition-colors duration-300 ease-out
        ${isSelected ? 'fill-red-600 stroke-red-300' : `${colors.fill} ${colors.stroke}`}
        ${!isSelected && status.health >= 70 ? 'hover:fill-[#cbd5e1]' : ''}
    `

    // Animation variants for status
    const pulseVariant: any = {
        animate: status.health < 30 && !isSelected ? {
            fillOpacity: [0.6, 1, 0.6],
            strokeWidth: [2, 3, 2],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        } : {}
    }

    return (
        <motion.g
            onClick={() => selectPart(isSelected ? null : id)}
            className={groupClassName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <title>{status.label} ({Math.round(status.health)}%) - {status.condition.toUpperCase()}</title>
            {paths.map((d, index) => (
                <motion.path
                    key={index}
                    d={d}
                    className={pathClassName}
                    variants={pulseVariant}
                    animate="animate"
                />
            ))}
        </motion.g>
    )
}

export const BodySilhouette = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <svg
                viewBox="0 0 400 600"
                className="w-full h-full max-h-[600px] drop-shadow-2xl"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            >
                {BODY_PARTS_PATHS.map((part) => (
                    <BodyPartGroup
                        key={part.id}
                        id={part.id}
                        paths={part.paths}
                    />
                ))}
            </svg>
        </div>
    )
}
