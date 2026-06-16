/**
 * Tiny scoped logger.
 *
 * - Level is controlled by `EXPO_PUBLIC_LOG_LEVEL` (debug|info|warn|error);
 *   defaults to `debug` in development and `warn` in production.
 * - In production, payloads are redacted: known sensitive keys are masked and
 *   nested objects/arrays are summarized to avoid leaking PII into logs.
 *
 * Usage:
 *   const log = createLogger('Auth');
 *   log.info('signed in', { userId });
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogPayload =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null
  | undefined;

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const isDevEnvironment = (): boolean => {
  if (typeof __DEV__ !== 'undefined') return __DEV__;
  return process.env.NODE_ENV !== 'production';
};

const minLevel = (): LogLevel => {
  const configured = process.env.EXPO_PUBLIC_LOG_LEVEL as LogLevel | undefined;
  if (configured && configured in LEVEL_WEIGHT) return configured;
  return isDevEnvironment() ? 'debug' : 'warn';
};

const redactPayload = (payload: LogPayload): LogPayload => {
  if (isDevEnvironment()) return payload;
  if (payload === undefined || payload === null) return payload;
  if (typeof payload !== 'object') return '[redacted]';

  const sensitiveKeys = ['prompt', 'messages', 'history', 'content', 'response', 'token', 'email'];
  if (Array.isArray(payload)) return `[array:${payload.length}]`;

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
      key,
      sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
        ? '[redacted]'
        : typeof value === 'object' && value !== null
          ? '[object]'
          : value,
    ])
  );
};

const shouldLog = (level: LogLevel) => LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[minLevel()];

export const createLogger = (scope: string) => {
  const emit = (level: LogLevel, message: string, payload?: LogPayload) => {
    if (!shouldLog(level)) return;
    const prefix = `[${scope}] ${message}`;
    const safePayload = redactPayload(payload);

    if (safePayload === undefined) {
      console[level](prefix);
      return;
    }

    console[level](prefix, safePayload);
  };

  return {
    debug: (message: string, payload?: LogPayload) => emit('debug', message, payload),
    info: (message: string, payload?: LogPayload) => emit('info', message, payload),
    warn: (message: string, payload?: LogPayload) => emit('warn', message, payload),
    error: (message: string, payload?: LogPayload) => emit('error', message, payload),
  };
};
