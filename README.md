# TUIdoro

TUIdoro is a minimal pomodoro timer that runs in your terminal.

![screenshot](./assets/screenshot1.png)

## Installation

### Via npx / bunx (requires bun > 1.3.0)

```bash
npx tuidoro (requires 'bun' to be in PATH)
bunx tuidoro
```

### Via AUR (contains Bun runtime (~100MB))

```bash
yay -S aur/tuidoro
```

### Run locally (requires bun > 1.3.0)

```bash
bun install
bun run build
./dist/tuidoro
```

## Configuration

The configuration file will be created on initial startup:

`~/.config/tuidoro/settings.json`

## Contributing

Pull requests and issues are welcome! I do however plan on keeping this TUI as simple as possible.  
Feel free to fork this project and extend the TUI to fit your own personal needs.

## License

[MIT](./LICENSE)
