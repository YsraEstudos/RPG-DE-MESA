import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type QuestStatus = 'todo' | 'progress' | 'done'

export interface Quest {
    id: string
    title: string
    description: string
    status: QuestStatus
    difficulty: 'Fácil' | 'Médio' | 'Difícil' | 'Mortal'
    notes: string
    reward?: string
}

interface QuestStore {
    quests: Quest[]
    addQuest: (quest: Omit<Quest, 'id' | 'status'>) => void
    updateQuestStatus: (id: string, status: QuestStatus) => void
    updateQuestNotes: (id: string, notes: string) => void
    removeQuest: (id: string) => void
}

export const useQuestStore = create<QuestStore>()(
    persist(
        (set) => ({
            quests: [
                {
                    id: '1',
                    title: 'Ervas Medicinais',
                    description: 'Colete 5 ervas luaminosa na Floresta Negra.',
                    status: 'todo',
                    difficulty: 'Fácil',
                    notes: '',
                    reward: '50 Moedas de Ouro'
                },
                {
                    id: '2',
                    title: 'O Troll da Ponte',
                    description: 'Derrote o troll que cobra pedágio na ponte velha.',
                    status: 'progress',
                    difficulty: 'Médio',
                    notes: 'Ele parece ter medo de fogo.',
                    reward: 'Espada Enferrujada'
                },
                {
                    id: '3',
                    title: 'Entrega Secreta',
                    description: 'Entregue a carta selada ao estalajadeiro.',
                    status: 'done',
                    difficulty: 'Fácil',
                    notes: 'Entregue com sucesso.',
                    reward: 'Cerveja Grátis'
                }
            ],
            addQuest: (quest) =>
                set((state) => ({
                    quests: [
                        ...state.quests,
                        { ...quest, id: crypto.randomUUID(), status: 'todo' }
                    ]
                })),
            updateQuestStatus: (id, status) =>
                set((state) => ({
                    quests: state.quests.map((q) =>
                        q.id === id ? { ...q, status } : q
                    )
                })),
            updateQuestNotes: (id, notes) =>
                set((state) => ({
                    quests: state.quests.map((q) =>
                        q.id === id ? { ...q, notes } : q
                    )
                })),
            removeQuest: (id) =>
                set((state) => ({
                    quests: state.quests.filter((q) => q.id !== id)
                }))
        }),
        {
            name: 'rpg-quests-storage-v1'
        }
    )
)
