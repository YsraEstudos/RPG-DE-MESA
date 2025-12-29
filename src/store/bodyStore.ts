import { create } from 'zustand'

export type BodyPartName = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg'

export interface BodyPartStatus {
    name: BodyPartName
    health: number // 0-100
    condition: 'healthy' | 'injured' | 'broken' | 'critical'
    label: string
}

export interface BodyStats {
    health: number // 0-100
    energy: number // 0-100
    hunger: number // 0-100
    thirst: number // 0-100
    sanity: number // 0-100
}

interface BodyState {
    stats: BodyStats
    parts: Record<BodyPartName, BodyPartStatus>
    selectedPart: BodyPartName | null

    // Actions
    updateStat: (stat: keyof BodyStats, value: number) => void
    selectPart: (part: BodyPartName | null) => void
    updatePartCondition: (part: BodyPartName, health: number) => void
}

const DEFAULT_PARTS: Record<BodyPartName, BodyPartStatus> = {
    head: { name: 'head', health: 100, condition: 'healthy', label: 'Cabeça' },
    torso: { name: 'torso', health: 100, condition: 'healthy', label: 'Torso' },
    leftArm: { name: 'leftArm', health: 100, condition: 'healthy', label: 'Braço Esq.' },
    rightArm: { name: 'rightArm', health: 100, condition: 'healthy', label: 'Braço Dir.' },
    leftLeg: { name: 'leftLeg', health: 100, condition: 'healthy', label: 'Perna Esq.' },
    rightLeg: { name: 'rightLeg', health: 100, condition: 'healthy', label: 'Perna Dir.' },
}

export const useBodyStore = create<BodyState>((set) => ({
    stats: {
        health: 100,
        energy: 80,
        hunger: 20,
        thirst: 10,
        sanity: 95,
    },
    parts: DEFAULT_PARTS,
    selectedPart: null,

    updateStat: (stat, value) =>
        set((state) => ({
            stats: { ...state.stats, [stat]: Math.max(0, Math.min(100, value)) },
        })),

    selectPart: (part) => set({ selectedPart: part }),

    updatePartCondition: (partName, health) =>
        set((state) => {
            const condition =
                health <= 0 ? 'broken' : health < 30 ? 'critical' : health < 70 ? 'injured' : 'healthy'

            return {
                parts: {
                    ...state.parts,
                    [partName]: {
                        ...state.parts[partName],
                        health: Math.max(0, Math.min(100, health)),
                        condition,
                    },
                },
            }
        }),
}))
