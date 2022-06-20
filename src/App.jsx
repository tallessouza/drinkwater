import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./Hidratese.json";

function App() {
  const [mensagem, setMensagem] = useState("")
  const [currentAccount, setCurrentAccount] = useState("");
  const [allDrinks, setAllDrinks] = useState([]);
  const contractAddress = "0xE7ABa389cF2FeFCF1A2a85e511Bd16E716A567e2";
  const contractABI = abi.abi;

  const checkWallet = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (!ethereum) {
        //console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        //console.log("Temos o objeto ethereum", ethereum);
      }

      if (accounts.length !== 0) {
        const account = accounts[0];
        //console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        //console.log("Nenhuma conta autorizada foi encontrada")
      }
      getAllDrinks()
    } catch (error) {
      //console.log(error);
    }
  }
  const connect = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      //console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      //console.log(error)
    }
  }

  const drink = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await contract.getCoposAgua();
        //console.log("Recuperado o número de drinks...", count.toNumber());
        const drinkTxn = await contract.pegaCopo(mensagem);
        //console.log("Minerando...", drinkTxn.hash);

        await drinkTxn.wait();
        //console.log("Minerado -- ", drinkTxn.hash);

        count = await contract.getCoposAgua();
        //console.log("Total de tchauzinhos recuperado...", count.toNumber());
      } else {
        //console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      //console.log(error)
    }
  }
  useEffect(() => {
    checkWallet()
  }, [currentAccount])

  const getAllDrinks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const drinks = await contract.getAllDrinks();

        let drinksCleaned = [];
        drinks.forEach(drink => {
          drinksCleaned.push({
            address: drink.drinker,
            timestamp: new Date(drink.timestamp * 1000),
            message: drink.message
          });
        });
        setAllDrinks(drinksCleaned);
      } else {
        //console.log("Objeto Ethereum não existe!")
      }
    } catch (error) {
      //console.log(error);
    }
  }
  useEffect(() => {
    let contract;

    const onNewDrink = (from, timestamp, message) => {
      //console.log("NewDrink", from, timestamp, message);
      setAllDrinks(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      contract = new ethers.Contract(contractAddress, contractABI, signer);
      contract.on("NewDrink", onNewDrink);
    }

    return () => {
      if (contract) {
        contract.off("NewDrink", onNewDrink);
      }
    };
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="App-header">
        <h1>Quanto de água você bebeu hoje?</h1>
        <div className='cup'>
        </div>
        <h3>Seja sincero!</h3>
        {!currentAccount ?
          <button type="button" onClick={connect}>
            Conectar
          </button>
          :
          <>
            <input type="text" className="mensagemInput" placeholder="Responda aqui" value={mensagem} onChange={e => setMensagem(e.target.value)} />
            <button type="button" onClick={drink}>
              Responder
            </button>
            <p>As seguintes pessoas já participaram:</p>
            {
              allDrinks.map((drink, index) => {
                return (
                  <div key={index} className="card">
                    <div>Endereço: {drink.address}</div>
                    <div>Data/Horário: {drink.timestamp.toString()}</div>
                    <div>Mensagem: {drink.message}</div>
                  </div>)
              }).reverse()}
          </>
        }
        <p>Meu Git: <a href='https://github.com/tallessouza' target={'_blank'}>tallessouza</a></p>
      </div>
    </div>
  )
}

export default App

