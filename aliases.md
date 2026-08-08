# Development
Requires both `compose.yml` and `compose.override.yml`.
```bash
alias build='docker compose up --build'
alias down='docker compose down'
```

# Production
Requires `compose.yml` alone.
```bash
alias run='docker compose up -d'
```
