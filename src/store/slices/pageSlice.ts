import { createSlice } from '@reduxjs/toolkit'
import type { Transaction } from '../../../public/data'

interface PageState {
    active: boolean,
    recentTransaction?: Transaction,
    mode: 'edit' | 'delete' | 'search' | 'add'
}

const initialState: PageState = {
    active: false,
    recentTransaction: undefined,
    mode: 'search'
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.active = !state.active
        },
        setRecentTransaction: (state, action) => {
            state.recentTransaction = action.payload
        },
        setMode: (state, action) => {
            state.mode = action.payload
        }
    },
})

export const { toggleModal, setRecentTransaction ,setMode} = pageSlice.actions
export default pageSlice.reducer
