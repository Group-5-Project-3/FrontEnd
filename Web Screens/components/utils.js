import React, { useEffect, useState, useContext } from 'react';

export function decodeJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    return JSON.parse(jsonPayload);
}

const isTokenExpired = (decodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    return decodedToken.exp < currentTime;
};