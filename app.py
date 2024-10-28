import os
from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
from flask_cors import CORS

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173"]}})

TOOL_LIST = {
 'MAT001': ['Serra Circular', 'Ferramentas de Corte', 1],
 'MAT002': ['Disco de Corte', 'Ferramentas de Corte', 0],
 'MAT003': ['Serra de Fita', 'Ferramentas de Corte', 0],
 'MAT004': ['Disco de Desbaste', 'Ferramentas de Corte', 1],
 'MAT005': ['Broca de Aço Rápido 10mm', 'Ferramentas de Corte', 1],
 'MAT006': ['Conjunto de Fresas para Usinagem', 'Ferramentas de Corte', 1],
 'MAT007': ['Lâmina de Serra Sabre', 'Ferramentas de Corte', 0],
 'EQP001': ['Lixadeira Angular', 'Ferramentas de Corte', 0],
 'MAT101': ['Paquímetro Digital', 'Ferramentas de Medição', 0],
 'MAT102': ['Micrômetro', 'Ferramentas de Medição', 1],
 'MAT103': ['Relógio Comparador', 'Ferramentas de Medição', 1],
 'MAT104': ['Trena de Aço 5m', 'Ferramentas de Medição', 1],
 'MAT105': ['Nível de Bolha', 'Ferramentas de Medição', 1],
 'MAT106': ['Goniômetro Digital', 'Ferramentas de Medição', 1],
 'MAT107': ['Manômetro para Pressão', 'Ferramentas de Medição', 1],
 'MAT108': ['Calibrador de Roscas', 'Ferramentas de Medição', 1],
 'EQP201': ['Máquina de Solda MIG', 'Equipamentos de Solda', 1],
 'MAT201': ['Eletrodo de Solda Inox', 'Equipamentos de Solda', 1],
 'MAT202': ['Máscara de Solda Automática', 'Equipamentos de Solda', 0],
 'EQP202': ['Maçarico de Corte Oxiacetilênico', 'Equipamentos de Solda', 1],
 'MAT203': ['Tocha de Solda TIG', 'Equipamentos de Solda', 1],
 'MAT204': ['Fio de Solda MIG ER70S-6', 'Equipamentos de Solda', 1],
 'MAT205': ['Regulador de Pressão para Gás', 'Equipamentos de Solda', 1],
 'MAT206': ['Tubo de Gás Acetileno', 'Equipamentos de Solda', 1],
 'MAT301': ['Graxa Industrial', 'Lubrificação e Manutenção', 1],
 'MAT302': ['Óleo Lubrificante 10W30', 'Lubrificação e Manutenção', 0],
 'EQP301': ['Bomba de Graxa Pneumática', 'Lubrificação e Manutenção', 1],
 'MAT303': ['Limpa Contatos Elétricos', 'Lubrificação e Manutenção', 1],
 'MAT304': ['Spray Desengripante', 'Lubrificação e Manutenção', 1],
 'MAT305': ['Veda Rosca em Fita', 'Lubrificação e Manutenção', 1],
 'MAT401': ['Capacete de Segurança com Aba', 'Equipamentos de Segurança', 0],
 'MAT402': ['Luvas Térmicas de Alta Resistência', 'Equipamentos de Segurança', 1],
 'MAT403': ['Óculos de Proteção Antirrespingos', 'Equipamentos de Segurança', 1],
 'MAT404': ['Protetor Auricular Tipo Plug', 'Equipamentos de Segurança', 1],
 'MAT405': ['Máscara Respiratória com Filtro P3', 'Equipamentos de Segurança', 1],
 'MAT406': ['Cinto de Segurança para Trabalho em Altura', 'Equipamentos de Segurança', 0],
 'MAT407': ['Sapato de Segurança com Biqueira de Aço', 'Equipamentos de Segurança', 0],
 'MAT408': ['Protetor Facial de Policarbonato', 'Equipamentos de Segurança', 0],
 'EQP501': ['Talha Elétrica de Corrente', 'Equipamentos de Elevação', 1],
 'MAT501': ['Corrente de Elevação de 10m', 'Equipamentos de Elevação', 1],
 'MAT502': ['Gancho Giratório com Trava de Segurança', 'Equipamentos de Elevação', 1],
 'MAT503': ['Cinta de Elevação com Olhal', 'Equipamentos de Elevação', 1],
 'EQP502': ['Carrinho de Transporte de Bobinas', 'Equipamentos de Elevação', 1],
 'EQP503': ['Macaco Hidráulico 10 Toneladas', 'Equipamentos de Elevação', 1],
 'MAT601': ['Rolamento Esférico de Precisão', 'Componentes Mecânicos', 1],
 'MAT602': ['Parafuso de Alta Resistência M12', 'Componentes Mecânicos', 0],
 'MAT603': ['Correia de Transmissão Industrial', 'Componentes Mecânicos', 1],
 'MAT604': ['Junta de Vedação em Borracha', 'Componentes Mecânicos', 1],
 'MAT605': ['Engrenagem Cilíndrica de Aço', 'Componentes Mecânicos', 1],
 'MAT606': ['Bucha de Bronze Autolubrificante', 'Componentes Mecânicos', 1],
 'MAT607': ['Eixo de Transmissão', 'Componentes Mecânicos', 0],
 'MAT608': ['Polia de Alumínio', 'Componentes Mecânicos', 1],
 'EQP601': ['Válvula Solenoide Hidráulica', 'Equipamentos Hidráulicos', 1],
 'EQP602': ['Bomba Hidráulica de Pistão', 'Equipamentos Hidráulicos', 1],
 'MAT701': ['Mangueira Hidráulica de Alta Pressão', 'Equipamentos Hidráulicos', 1],
 'MAT702': ['Conector Hidráulico Rápido', 'Equipamentos Hidráulicos', 0],
 'EQP701': ['Motor Elétrico Trifásico 5HP', 'Equipamentos Elétricos', 0],
 'MAT801': ['Cabo Elétrico 10mm²', 'Equipamentos Elétricos', 1],
 'MAT802': ['Disjuntor de 100A', 'Equipamentos Elétricos', 1],
 'EQP702': ['Quadro de Comando Elétrico com Inversor de Frequência', 'Equipamentos Elétricos', 1],
 'MAT803': ['Chave Seccionadora', 'Equipamentos Elétricos', 0],
 'MAT804': ['Fusível NH 100A', 'Equipamentos Elétricos', 1],
 'MAT805': ['Tomada Industrial 380V', 'Equipamentos Elétricos', 1],
 'MAT901': ['Chave de Fenda Phillips 6mm', 'Ferramentas Manuais', 1],
 'MAT902': ['Alicate de Corte', 'Ferramentas Manuais', 0],
 'MAT903': ['Martelo de Borracha', 'Ferramentas Manuais', 1],
 'MAT904': ['Torquímetro 40-200Nm', 'Ferramentas Manuais', 1],
 'MAT905': ['Conjunto de Chaves Allen', 'Ferramentas Manuais', 0],
 'MAT906': ['Chave Estrela 12mm', 'Ferramentas Manuais', 1],
 'MAT907': ['Serra Manual', 'Ferramentas Manuais', 1]
}

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files or 'file_type' not in request.form:
        return jsonify({'error': 'O campo "file" e "file_type" são obrigatórios.'}), 400

    audio_file = request.files['file']
    file_type = request.form['file_type']

    if file_type != 'audio':
        return jsonify({"error": "Formato de arquivo não suportado."}), 400

    try:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
        return jsonify({'text': transcription['text']}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/analyze", methods=['POST'])
def analyze_text_with_chatgpt():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'O campo "text" é obrigatório.'}), 400

    text = data['text']

    """Usa a API do ChatGPT para processar o texto e extrair as ferramentas necessárias"""

    # Formatando TOOL_LIST para exibir nome e tipo de cada ferramenta
    formatted_tools = [
        f"{code}: {info[0]} ({info[1]})" for code, info in TOOL_LIST.items()
    ]

    # Gerando o prompt para a API
    prompt = (
        f"Com base no serviço de manutenção descrito: '{text}', identifique quais "
        f"ferramentas da lista a seguir são necessárias:\n"
        f"Retorne a resposta no formato de um array, em que cada valor é o código de um equipamento. Exemplo: ['MAT001', 'MAT002']\n"
        f"Importante: retorne apenas itens que existem na lista que te foi passada."
        f"{'; '.join(formatted_tools)}"
    )

    # Fazendo a chamada à API do ChatGPT
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Você é um assistente que ajuda a identificar ferramentas para serviços de manutenção."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0.5,
        n=1
    )

    result = response.choices[0].message.content

    # Inicializa o dicionário ou lista de tuplas para armazenar os equipamentos encontrados


    # Extraindo e retornando a resposta
    print(response.choices[0].message.content)
    return jsonify({"response": result}), 200

@app.route("/return_inavaliables", methods=['POST'])
def return_avaliability():
    data = request.get_json()
    if not data or 'list' not in data:
        return jsonify({'error': 'O campo "list" é obrigatório.'}), 400

    list = data['list']
    indisponiveis = []
    print(list[0])

    for element in list:
        if element in TOOL_LIST:
            isAvailable = TOOL_LIST[element][-1]
            if (isAvailable == 0):
                indisponiveis.append(element)

    return jsonify({"indisponiveis": indisponiveis}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
