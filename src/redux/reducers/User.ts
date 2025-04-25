import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: '',
    fullName: '',
    email: '',
    photoURL: '',
    id: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username
            state.fullName = action.payload.fullName
            state.email = action.payload.email
            state.photoURL = action.payload.photoURL
            state.id = action.payload.id
        },
        clearUser: (state) => {
            state.username = ''
            state.fullName = ''
            state.email = ''
            state.photoURL = ''
            state.id = ''
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer