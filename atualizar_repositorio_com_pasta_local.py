import os
import hashlib
import shutil

PASTA_LOCAL = r"C:\Users\lucas\Downloads\BAGUNÇA GITHUB\Nova pasta"  # Caminho da pasta local no seu computador
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
            caminho_origem = os.path.join(root, nome_arquivo)
            arquivos_encontrados.append(caminho_origem)
    print(f"\nTotal de arquivos encontrados: {len(arquivos_encontrados)}")
    print("Arquivos encontrados na pasta local:")
    for arquivo in arquivos_encontrados:
        print(arquivo)
    print("\nIniciando comparação e atualização...\n")
    for caminho_origem in arquivos_encontrados:
        caminho_relativo = os.path.relpath(caminho_origem, PASTA_LOCAL)
        caminho_destino = os.path.join(REPOSITORIO, caminho_relativo)

        print(f"Comparando:\n  Origem: {caminho_origem}\n  Destino: {caminho_destino}")

        if arquivos_diferentes(caminho_origem, caminho_destino):
            os.makedirs(os.path.dirname(caminho_destino), exist_ok=True)
            shutil.copy2(caminho_origem, caminho_destino)
            print(f"Arquivo atualizado: {caminho_relativo}")
        else:
            print(f"Sem alteração: {caminho_relativo}")
            if os.path.exists(caminho_destino):
                print(f"Hash origem: {hash_arquivo(caminho_origem)}")
                print(f"Hash destino: {hash_arquivo(caminho_destino)}")

if __name__ == "__main__":
    atualizar_arquivos()