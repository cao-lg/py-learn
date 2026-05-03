export function getUserId(): string | null {
  return localStorage.getItem('uums_user_id');
}

export function setUserId(userId: string): void {
  localStorage.setItem('uums_user_id', userId);
}

export function getUserName(): string | null {
  return localStorage.getItem('uums_username');
}

export function setUserName(name: string): void {
  localStorage.setItem('uums_username', name);
}

export function clearUserData(): void {
  localStorage.removeItem('uums_user_id');
  localStorage.removeItem('uums_username');
}
