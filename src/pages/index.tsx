import { FormEvent, useState } from "react";

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type Player = {
  id: number;
  name: string;
  score: number;
};

const CARD_VALUES = ['🐶', '🐱', '🐰', '🐻', '🦊', '🐼', '🐟', '🦆', '🦖​', '🦚​'];

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerNamesInput, setPlayerNamesInput] = useState<string>('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [lockBoard, setLockBoard] = useState(false);

  const adicionarJogadores = () => {
    if (playerNamesInput.length > 1) {
      console.log(playerNamesInput)
      const jogador: Player = {
        id: (players.length + 1),
        name: playerNamesInput,
        score: 0,
      }

      setPlayerNamesInput('')
      setPlayers([...players, jogador])
    }
  }

  const startGame = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex(0);
      setGameStarted(true);
  
      const duplicated = [...CARD_VALUES, ...CARD_VALUES];
      const shuffled = duplicated
        .map((value, i) => ({ id: i, value, isFlipped: false, isMatched: false }))
        .sort(() => Math.random() - 0.5);
      setCards(shuffled);
    } 
  };

  const handleClick = (index: number) => {
    if (lockBoard || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    const newFlipped = [...flipped, index];

    setCards(newCards);
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLockBoard(true);
      const [first, second] = newFlipped;
      if (newCards[first].value === newCards[second].value) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;

        const newPlayers = [...players];
        newPlayers[currentPlayerIndex].score += 1;

        setTimeout(() => {
          setCards([...newCards]);
          setPlayers(newPlayers);
          setFlipped([]);
          setLockBoard(false);
          // mesmo jogador continua
        }, 800);
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards([...newCards]);
          setFlipped([]);
          setLockBoard(false);
          setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
        }, 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <main className="container">
       <h1>🧠 Jogo da Memória - Multiplayer</h1>
       <p>Adicione o nome dos jogadores:</p>
      <form>
        <label htmlFor="jogador">
          <input type="text" name="jogador" id="jogador" value={playerNamesInput} onChange={(e: FormEvent<HTMLInputElement>) => {setPlayerNamesInput(e.currentTarget.value)}} />
          <button type="button" onClick={adicionarJogadores}>Adicionar</button>
        </label>
      </form>
      <h2>Lista Jogadores</h2>
      <ul>
        {
          players.map(({id, name, score}) => (
            <li>
              {name}
            </li>
          ))
        }
      </ul>
      <button onClick={startGame}>Iniciar Jogo</button>
    </main>
    )
  }

  return (
    <main className="container">
      <h1>🧠 Jogo da Memória</h1>
      <h2>Jogador atual: {players[currentPlayerIndex].name}</h2>
      <div className="scoreboard">
        {players.map(({name, id, score}) => (
          <div key={id} className={`player ${id === currentPlayerIndex ? 'active' : ''}`}>
            {name}: {score}
          </div>
        ))}
      </div>
      <div className="flex">
        {cards.map((card, index) => (
          <div className={`card ${card.isFlipped || card.isMatched ? 'card-flipped' : ''}`} onClick={() => handleClick(index)}>
          <div className="card-inner">
            <div className="card-front">
              <p className="icon">'❓'</p>
            </div>
            <div className="card-back">
              <p className="icon">{card.value}</p>
            </div>
          </div>
        </div>
        ))}
      </div>
    </main>
  
  );
}
