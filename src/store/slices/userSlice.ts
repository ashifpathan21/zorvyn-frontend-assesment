import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { transactions } from '../../../public/data'
import type { Transaction } from '../../../public/data'

interface UserState {
    role: 'user' | 'admin',
    transactions: Transaction[]
}

export const loadTransactions = (): Transaction[] => {
    try {
        const data = localStorage.getItem("transactions");
        if (!data) return transactions as Transaction[];

        return JSON.parse(data).map((t: any) => ({
            ...t,
            date: new Date(t.date),
        }));
    } catch {
        return transactions as Transaction[];
    }
};

const initialState: UserState = {
    role: 'user',
    transactions: loadTransactions()
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeRole: (state) => {
            state.role = state.role === 'user' ? 'admin' : 'user'
        },

        addTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin') {
                state.transactions.push(action.payload)
                localStorage.setItem('transactions', JSON.stringify(state.transactions))
            }
        },
        editTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin') {
                state.transactions = state.transactions.map((transaction) =>
                    transaction.id === action.payload.id ? action.payload : transaction
                );
                localStorage.setItem('transactions', JSON.stringify(state.transactions))
            }
        },
        removeTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin') {
                state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload.id)
                localStorage.setItem('transactions', JSON.stringify(state.transactions))
            }

        }
    },
})

export const { changeRole, addTransaction, editTransaction, removeTransaction } = userSlice.actions
export default userSlice.reducer