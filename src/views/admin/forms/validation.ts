const EMAIL_MAX_LENGTH = 150;
const PASSWORD_MAX_LENGTH = 150;

export function validateEmail(email: string): string | null {
    const trimmed = email.trim();

    if (trimmed.length === 0) {
        return 'Введите email';
    }

    if (/^\s*$/.test(email)) {
        return 'Email не может состоять из пробелов';
    }

    if (trimmed.length > EMAIL_MAX_LENGTH) {
        return `Email не может превышать ${EMAIL_MAX_LENGTH} символов`;
    }

    if (!trimmed.includes('@')) {
        return 'Неверный формат email';
    }

    return null;
}

export function validatePassword(password: string): string | null {
    if (password.length === 0) {
        return 'Введите пароль';
    }

    if (password.length > PASSWORD_MAX_LENGTH) {
        return `Пароль не может превышать ${PASSWORD_MAX_LENGTH} символов`;
    }

    return null;
}

export function validatePasswordConfirm(password: string, confirm: string): string | null {
    if (confirm.length === 0) {
        return 'Подтвердите пароль';
    }

    if (password !== confirm) {
        return 'Пароли не совпадают';
    }

    return null;
}

export function sanitizeEmail(email: string): string {
    return email.trim();
}

export const INPUT_MAX_LENGTH = 150;
