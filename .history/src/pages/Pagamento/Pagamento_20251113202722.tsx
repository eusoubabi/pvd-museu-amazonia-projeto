import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagamento.css';

export const Pagamento = () => {

    // Navegação
    const navigate = useNavigate();

    // Dados de cartão
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Dados do cliente
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    // Mock do pedido
    const totalAmount = 20.00;
    const mockCartItems = [
        { name: 'Ingresso Inteira (1x)', price: 20.00 },
    ];

    // --- HANDLERS DE FORMATAÇÃO ---
    const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardName(e.target.value.toUpperCase());
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setCardNumber(value);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 4);
        if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
        setExpiry(value);
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 3);
        setCvv(value);
    };

    // --- SUBMISSÃO DO PAGAMENTO ---
    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const rawCardNumber = cardNumber.replace(/\s/g, '');
        const rawExpiry = expiry.replace(/\//g, '');

        // Validações
        if (!userName.trim() || !userEmail.trim()) {
            alert("Preencha seus dados antes de continuar.");
            return;
        }

        if (!cardName.trim()) {
            alert("Digite o nome no cartão.");
            return;
        }

        if (rawCardNumber.length !== 16) {
            alert("O cartão deve ter 16 dígitos.");
            return;
        }

        if (rawExpiry.length !== 4) {
            alert("A validade deve estar no formato MM/AA.");
            return;
        }

        if (cvv.length !== 3) {
            alert("O CVV deve ter 3 dígitos.");
            return;
        }

        console.log("Pagamento válido:", {
            userName,
            userEmail,
            cardName,
            cardNumber,
            expiry,
            cvv
        });

        // ALERTA → antes do navigate (senão bloqueia)
        alert("Pagamento Submetido com Sucesso!");

        // REDIRECIONA para a tela de sucesso
        navigate("/pagamento/sucesso");
    };

    return (
        <div className="payment-container">
            <div className="payment-form-side">
                <form onSubmit={handlePaymentSubmit} className="payment-form">

                    {/* SEUS DADOS */}
                    <fieldset>
                        <legend>1. Seus Dados</legend>
                        <div className="form-row">
                            <div>
                                <label htmlFor="name">Nome Completo</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Nome do Cliente"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email">E-mail</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    placeholder="seu.email@exemplo.com"
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* PAGAMENTO */}
                    <fieldset>
                        <legend>2. Informações de Pagamento (Cartão)</legend>

                        <label htmlFor="cardName">Nome no Cartão</label>
                        <input
                            type="text"
                            id="cardName"
                            value={cardName}
                            onChange={handleCardNameChange}
                            placeholder="NOME COMPLETO"
                            required
                            maxLength={50}
                        />

                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                            type="tel"
                            id="cardNumber"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            placeholder="0000 0000 0000 0000"
                            required
                        />

                        <div className="form-row">
                            <div>
                                <label htmlFor="expiry">Validade (MM/AA)</label>
                                <input
                                    type="tel"
                                    id="expiry"
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                    placeholder="MM/AA"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="cvv">CVV</label>
                                <input
                                    type="tel"
                                    id="cvv"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                    maxLength={3}
                                    placeholder="123"
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" className="payment-submit-btn">
                        Finalizar Pagamento (R$ {totalAmount.toFixed(2)})
                    </button>
                </form>
            </div>

            {/* RESUMO */}
            <div className="payment-summary-side">
                <h3>Resumo do Pedido</h3>

                {mockCartItems.map((item, index) => (
                    <div className="summary-item" key={index}>
                        <span>{item.name}</span>
                        <span>R$ {item.price.toFixed(2)}</span>
                    </div>
                ))}

                <div className="summary-total">
                    <span>TOTAL</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
