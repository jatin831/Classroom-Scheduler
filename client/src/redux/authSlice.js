import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        email: null,
        expireTime: null
    },
    reducers: {
        SET_LOGIN: (state, action) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.expireTime = action.payload.expireTime;
        },
        LOGOUT: (state) => {
            localStorage.removeItem('authDetails');
            window.location.reload();
        }
    }
})

export const { SET_LOGIN, LOGOUT } = authSlice.actions;

export const LOGIN = (email, password, closeModalUtil) => dispatch => {
    axios.post('/api/login', {
        email: email,
        password: password
    })
        .then(res => {
            const authDetails = {email: res.data.email, token: res.data.token, expireTime: res.data.expireTime};
            localStorage.setItem('authDetails', JSON.stringify(authDetails));
            dispatch(SET_LOGIN(authDetails));
            closeModalUtil();
        })
        .catch(err => {
            if (err.response) {
                alert(err.response.data.message);
            }
        })
}

export const AUTO_LOGIN = () => dispatch => {
    let authDetails = localStorage.getItem('authDetails');
    if (authDetails) {
        authDetails = JSON.parse(authDetails);
        console.log(authDetails);
        if (authDetails.expireTime < new Date().getTime()) {
            return;
        }
        dispatch(SET_LOGIN(authDetails));
    }
}

export const selectAuthData = state => state.auth;

export default authSlice.reducer;