import { MOCK_PASSWORD, MOCK_USERNAME } from '../constants/mockCredentials';

/**
 * Compara usuário e senha com as credenciais mockadas do projeto.
 * Não chama API, apenas compara com constantes locais.
 */
export function validateMockLogin(username: string, password: string): boolean {
    return username.trim() === MOCK_USERNAME && password === MOCK_PASSWORD;
}