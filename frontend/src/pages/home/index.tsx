import React, { useRef, useState } from "react";
import Input from "../../components/Input";
import { FaArrowUp } from "react-icons/fa";
import Button from "../../components/Button";

interface Message {
  text: string;
  type: "sent" | "received";
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const pdfInput = useRef<HTMLInputElement | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>(["MAT902"]);
  const [showChecklist, setShowChecklist] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(true);

  const TOOL_LIST = {
    MAT902: "Alicate de Corte",
    EQP602: "Bomba Hidráulica de Pistão",
    MAT005: "Broca de Aço Rápido 10mm",
    MAT801: "Cabo Elétrico 10mm²",
    MAT108: "Calibrador de Roscas",
    EQP502: "Carrinho de Transporte de Bobinas",
    MAT905: "Conjunto de Chaves Allen",
    MAT006: "Conjunto de Fresas para Usinagem",
    MAT503: "Cinta de Elevação com Olhal",
    MAT702: "Conector Hidráulico Rápido",
    MAT501: "Corrente de Elevação de 10m",
    MAT004: "Disco de Desbaste",
    MAT002: "Disco de Corte",
    MAT802: "Disjuntor de 100A",
    MAT201: "Eletrodo de Solda Inox",
    MAT204: "Fio de Solda MIG ER70S-6",
    MAT505: "Graxa Industrial",
    MAT301: "Graxa Industrial",
    MAT106: "Goniômetro Digital",
    MAT604: "Junta de Vedação em Borracha",
    MAT007: "Lâmina de Serra Sabre",
    MAT306: "Limpa Contatos Elétricos",
    MAT903: "Martelo de Borracha",
    MAT701: "Mangueira Hidráulica de Alta Pressão",
    MAT202: "Máscara de Solda Automática",
    MAT405: "Máscara Respiratória com Filtro P3",
    EQP201: "Máquina de Solda MIG",
    EQP501: "Talha Elétrica de Corrente",
    MAT101: "Paquímetro Digital",
    MAT602: "Parafuso de Alta Resistência M12",
    MAT404: "Protetor Auricular Tipo Plug",
    EQP702: "Quadro de Comando Elétrico com Inversor de Frequência",
    MAT205: "Regulador de Pressão para Gás",
    MAT601: "Rolamento Esférico de Precisão",
    MAT003: "Serra de Fita",
    MAT001: "Serra Circular",
    MAT304: "Spray Desengripante",
    EQP701: "Motor Elétrico Trifásico 5HP",
    MAT302: "Óleo Lubrificante 10W30",
    MAT403: "Óculos de Proteção Antirrespingos",
    MAT804: "Fusível NH 100A",
    EQP601: "Válvula Solenoide Hidráulica",
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  function checkboxHandler(tool: string) {
    setSelectedTools((prevSelected) =>
      prevSelected.includes(tool)
        ? prevSelected.filter((t) => t !== tool)
        : [...prevSelected, tool]
    );
  }

  const handleSearchSubmit = async () => {
    setSearchEnabled(false);
    if (!searchQuery.trim()) return;

    const newMessage: Message = { text: searchQuery, type: "sent" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch("YOUR_BACKEND_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      // Exibir o checklist após enviar a mensagem
      setShowChecklist(true);

      const data = await response.json();
      const receivedMessage: Message = {
        text: data.response,
        type: "received",
      };
      setMessages((prev) => [...prev, receivedMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSearchQuery("");
    }
  };

  const handleNewSearch = () => {
    setMessages([]);
    setSearchEnabled(true);
    setShowChecklist(false);
    setSelectedTools([]);
  };

  const handleRequest = async () => {
    try {
      const response = await fetch("YOUR_BACKEND_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tools: selectedTools }),
      });

      const data = await response.json();
      const receivedMessage: Message = {
        text: data.response,
        type: "received",
      };
      setMessages((prev) => [...prev, receivedMessage]);
    } catch (error) {
      console.error("Error sending request:", error);
    }
    setMessages((prev) => [
      ...prev,
      {
        text: "opa",
        type: "received",
      },
    ]);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("serviceOrder", file);

    const newMessage: Message = {
      text: `File uploaded: ${file.name}`,
      type: "sent",
    };
    setMessages((prev) => [...prev, newMessage]);

    const response = await fetch("YOUR_BACKEND_ENDPOINT", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    const receivedMessage: Message = { text: data.response, type: "received" };
    setMessages((prev) => [...prev, receivedMessage]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-semibold text-gray-800">
        Descreva o serviço
      </h1>
      <div className="text-[14px] mb-4">
        ou faça o upload da ordem de serviço
      </div>

      <div className="w-11/12 h-full flex flex-col mb-4">
        <div className="w-full md:h-[500px] flex-grow overflow-y-auto border border-gray-300 rounded-lg p-2 ">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.type === "sent" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  msg.type === "sent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {showChecklist && (
            <div className="flex flex-col my-4 ml-4 w-full max-w-lg border border-gray-300 bg-gray-200 rounded-lg p-2">
              <h2 className="text-lg font-semibold mb-2">
                Selecione as ferramentas:
              </h2>
              {Object.entries(TOOL_LIST).map(([key, toolName]) => (
                <label key={key} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={selectedTools.includes(key)}
                    onChange={() => checkboxHandler(key)}
                    className="mr-2"
                  />
                  {toolName}
                </label>
              ))}
              <div className="self-center flex gap-5 mt-5 mb-3">
                <Button onClick={handleNewSearch}>Fazer nova busca</Button>
                <Button onClick={handleRequest}>Enviar solicitação</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 w-11/12">
        <Input
          search={true}
          name="search"
          placeholder="Type a message..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onIconClick={() =>
            pdfInput.current !== null && pdfInput.current.click()
          }
        />

        <input
          type="file"
          className="hidden"
          ref={pdfInput}
          onChange={handleUpload}
        />
        <button
          onClick={handleSearchSubmit}
          disabled={!searchEnabled}
          className={`flex justify-center items-center rounded-full size-9  text-white transition ${
            searchEnabled ? "bg-primary" : "bg-slate-500"
          }`}
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </div>
  );
};

export default Home;
