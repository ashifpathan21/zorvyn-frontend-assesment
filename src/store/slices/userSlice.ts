import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { transactions } from '../../../public/data'
import type { Transaction } from '../../../public/data'

interface UserState {
    role: 'user' | 'admin',
    transactions: Transaction[]
}

const initialState: UserState = {
    role: 'user',
    transactions: transactions as Transaction[]
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeRole: (state) => {
            state.role = state.role === 'user' ? 'admin' : 'user'
        },
        
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin')
                state.transactions.push(action.payload)
        },
        editTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin') {
                state.transactions = state.transactions.map((transaction) =>
                    transaction.id === action.payload.id ? action.payload : transaction
                );
            }
        },
        removeTransaction: (state, action: PayloadAction<Transaction>) => {
            if (state.role === 'admin') {
                state.transactions = state.transactions.filter((transaction) => transaction.id !== action.payload.id)
            }
        }
    },
})

export const { changeRole, addTransaction, editTransaction, removeTransaction } = userSlice.actions
export default userSlice.reducer