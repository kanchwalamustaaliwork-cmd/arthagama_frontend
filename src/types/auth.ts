export interface AuthUser {
    email: string
    name: string
}

export interface AuthResult {
    user: AuthUser
    token: string
}

export interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    isInitializing: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}