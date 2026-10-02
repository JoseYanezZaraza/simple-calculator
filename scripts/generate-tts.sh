#!/usr/bin/env bash
# Genera los audios PROVISIONALES con la voz sintética de macOS.
# Para usar grabaciones propias, sustituye los .m4a de public/audio/es/ manteniendo los nombres.
# Solo genera los audios que faltan, para no pisar grabaciones propias.
# Uso: npm run audio:tts                 (voz por defecto: Mónica)
#      VOICE=Paulina npm run audio:tts
#      FORCE=1 npm run audio:tts         (regenera todos, ¡sobrescribe grabaciones!)
set -euo pipefail

VOICE="${VOICE:-Mónica}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/audio/es"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
mkdir -p "$OUT_DIR"

numbers=(cero uno dos tres cuatro cinco seis siete ocho nueve diez)

render() { # <nombre> <texto>
  if [[ -f "$OUT_DIR/$1.m4a" && -z "${FORCE:-}" ]]; then
    echo "  $1.m4a  (ya existe, se conserva)"
    return
  fi
  say -v "$VOICE" -r 150 -o "$TMP_DIR/$1.aiff" "$2"
  afconvert -f m4af -d aac -b 64000 "$TMP_DIR/$1.aiff" "$OUT_DIR/$1.m4a"
  echo "  $1.m4a  «$2»"
}

echo "Generando audios con la voz $VOICE en $OUT_DIR"
for i in "${!numbers[@]}"; do
  render "$i" "${numbers[$i]}"
done
render full "¡Está lleno! ¡Muy bien!"
render empty "No quedan frutas"
render howMany "¿Cuántas frutas hay?"
render put "Pon"
render wellDone "¡Muy bien!"
render letsCount "¡Vamos a contarlas!"
