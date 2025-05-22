import os
import hashlib
import shutil

PASTA_LOCAL = r"/workspaces/Gerador-de-Logo/ARQUIVOS"  # Caminho da pasta local no seu computador
REPOSITORIO = "."  # Raiz do repositório

def hash_arquivo(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            h.update(chunk)
    return h.hexdigest()

def arquivos_diferentes(path1, path2):
    if not os.path.exists(path2):
        return True
    return hash_arquivo(path1) != hash_arquivo(path2)

def atualizar_arquivos():
    print(f"Verificando arquivos em: {PASTA_LOCAL}")
    arquivos_encontrados = []
    for root, dirs, files in os.walk(PASTA_LOCAL):
        for nome_arquivo in files:
            if nome_arquivo == ".a":
                continue
            caminho_origem = os.path.join(root, nome_arquivo)
            arquivos_encontrados.append(caminho_origem)
    print(f"Total de arquivos encontrados: {len(arquivos_encontrados)}")

    arquivos_atualizados = []

    for caminho_origem in arquivos_encontrados:
        caminho_relativo = os.path.relpath(caminho_origem, PASTA_LOCAL)
        caminho_destino = os.path.join(REPOSITORIO, caminho_relativo)

        if arquivos_diferentes(caminho_origem, caminho_destino):
            os.makedirs(os.path.dirname(caminho_destino), exist_ok=True)
            shutil.copy2(caminho_origem, caminho_destino)
            arquivos_atualizados.append(caminho_relativo)

    if arquivos_atualizados:
        print("\nArquivos atualizados:")
        for arquivo in arquivos_atualizados:
            print(arquivo)
    else:
        print("\nNenhum arquivo atualizado.")

    print(f"\nTotal de atualizações: {len(arquivos_atualizados)}")

    # Deletar arquivos da pasta ARQUIVOS (ignorando o .a)
    for root, dirs, files in os.walk(PASTA_LOCAL):
        for nome_arquivo in files:
            if nome_arquivo == ".a":
                continue
            caminho_arquivo = os.path.join(root, nome_arquivo)
            try:
                os.remove(caminho_arquivo)
            except Exception as e:
                print(f"Erro ao deletar {caminho_arquivo}: {e}")

if __name__ == "__main__":
    atualizar_arquivos()