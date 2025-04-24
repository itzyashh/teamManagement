import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: '',
    fullName: '',
    email: '',
    photoURL: '',
    uid: '',
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
            state.uid = action.payload.uid
        },
        clearUser: (state) => {
            state.username = ''
            state.fullName = ''
            state.email = ''
            state.photoURL = ''
            state.uid = ''
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer