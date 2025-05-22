import subprocess
from datetime import datetime

IGNORAR = {"exportar_alterados.py"}

# Obter data/hora atual
agora = datetime.now()
timestamp_str = agora.strftime("%d-%m_%H-%M")
cabecalho_str = agora.strftime("Data de exportação: %d/%m às %H:%M")
nome_arquivo = f"alterados_{timestamp_str}.txt"

# 1. Obter arquivos alterados/adicionados com separador nulo
result = subprocess.run(
    ["git", "status", "--porcelain", "-z"],
    capture_output=True, text=True
)
entries = result.stdout.strip('\0').split('\0')
arquivos = []
for entry in entries:
    if not entry:
        continue
    status = entry[:2].strip()
    path = entry[3:] if entry[2] == ' ' else entry[2:]
    # Ignora arquivos definidos em IGNORAR e qualquer arquivo que começa com "alterados"
    if status in ['A', 'M', 'AM', '??'] and path not in IGNORAR and not path.startswith("alterados"):
        arquivos.append(path)

# 2. Criar mapeamento dos arquivos
mapeamento = []
for idx, arquivo in enumerate(arquivos, 1):
    mapeamento.append(f"{idx}. {arquivo}")

# 3. Escrever no arquivo de saída
with open(nome_arquivo, "w", encoding="utf-8") as out:
    out.write(f"{cabecalho_str}\n")
    out.write("Mapeamento de arquivos alterados/adicionados:\n")
    out.write("\n".join(mapeamento))
    out.write("\n\n")
    for idx, arquivo in enumerate(arquivos, 1):
        out.write(f"--- [{idx}] {arquivo} ---\n")
        try:
            with open(arquivo, "r", encoding="utf-8") as f:
                out.write(f.read())
        except Exception as e:
            out.write(f"[Erro ao ler o arquivo: {e}]\n")
        out.write("\n\n")