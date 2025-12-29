import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

interface Props {
    pageId: string
    label: string
}

/**
 * Default placeholder page for buttons that don't have a dedicated page yet.
 * Users can customize this by creating specific page components.
 */
export const DefaultPage = ({ label }: Props) => {
    return (
        <div className="h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full"
            >
                <div className="text-center">
                    <HelpCircle size={64} className="text-stone-700 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-stone-300 uppercase tracking-tight mb-4">
                        {label}
                    </h2>
                    <p className="text-stone-500 max-w-md mx-auto mb-8">
                        Esta seção ainda não possui conteúdo personalizado.
                        <br />
                        Adicione um componente de página para este setor.
                    </p>
                    <div className="inline-block px-6 py-3 bg-stone-900/50 border border-stone-800 text-stone-500 rounded-sm text-sm uppercase tracking-widest">
                        [ Em Construção ]
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
