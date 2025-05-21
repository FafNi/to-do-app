import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    return true;
  } else {
    // Можно использовать Router для перенаправления
    window.location.href = '/login';
    return false;
  }
};