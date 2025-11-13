import { useState } from 'react';
import './Pagamento.css';

export const Pagamento = () => {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // 4.1. Nome do Cartão: Apenas maiúsculas, remove caracteres especiais
    const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Converte para maiúsculas
        const formattedValue = e.target.value.toUpperCase();
        setCardName(formattedValue);
    };

    // 4.2. Número do Cartão: Formato XXXX XXXX XXXX XXXX (16 dígitos)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // 1. Remove tudo que não é dígito
        
        // 2. Limita a 16 dígitos
        value = value.substring(0, 16); 

        // 3. Insere espaços a cada 4 dígitos
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim(); 
        
        setCardNumber(formattedValue);
    };

    // 4.3. Validade: Formato MM/AA
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // 1. Remove tudo que não é dígito

        // 2. Limita a 4 dígitos (MMYY)
        value = value.substring(0, 4);

        if (value.length >= 2) {
            // Insere a barra / após o segundo dígito (Mês/Ano)
            value = value.substring(0, 2) + '/' + value.substring(2); 
        }
        
        setExpiry(value);
    };

    // 4.4. CVV: Limite para exatamente 3 dígitos
    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
        value = value.substring(0, 3); // Limita a 3 dígitos
        setCvv(value);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Removendo espaços/barras para validação
        const rawCardNumber = cardNumber.replace(/\s/g, '');
        const rawExpiry = expiry.replace(/\//g, '');
        
        if (cardName.trim().length === 0) {
            console.error('Por favor, preencha o nome no cartão.');
            // Lembrete: Use um modal em vez de alert()
            alert('Por favor, preencha o nome no cartão.');
            return;
        }

        if (rawCardNumber.length !== 16) {
            console.error('O número do cartão deve ter exatamente 16 dígitos.');
            alert('O número do cartão deve ter exatamente 16 dígitos.');
            return;
        }
        
        if (rawExpiry.length !== 4) {
             console.error('A validade deve ser preenchida como MM/AA.');
             alert('A validade deve ser preenchida como MM/AA.');
             return;
        }
        
        // VALIDAÇÃO EXATA DE 3 DÍGITOS
        if (cvv.length !== 3) {
            console.error('O CVV deve ter 3 dígitos.');
            alert('O CVV deve ter 3 dígitos.');
            return;
        }

        console.log({ cardName, cardNumber, expiry, cvv });
        alert('Pagamento Submetido com Sucesso!'); 
    };

    return (
        <div className="payment-container">
            <h2>Finalizar Pagamento</h2>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
                
                {/* CAMPO NOME DO CARTÃO */}
                <label htmlFor="cardName">Nome no Cartão (Apenas Maiúsculas)</label>
                <input
                    type="text"
                    id="cardName"
                    value={cardName}
                    onChange={handleCardNameChange}
                    placeholder="NOME COMPLETO"
                    required
                    maxLength={50}
                    // Garante que o texto exibido também seja MAIÚSCULO visualmente
                    style={{ textTransform: 'uppercase' }} 
                />

                {/* CAMPO NÚMERO DO CARTÃO */}
                <label htmlFor="cardNumber">Número do Cartão (XXXX XXXX XXXX XXXX)</label>
                <input
                    type="tel" // Tipo 'tel' é melhor para números em dispositivos móveis
                    id="cardNumber"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19} // 16 dígitos + 3 espaços = 19
                    placeholder="0000 0000 0000 0000"
                    required
                />

                <div className="expiry-cvv-group">
                    {/* CAMPO VALIDADE */}
                    <div>
                        <label htmlFor="expiry">Validade (MM/AA)</label>
                        <input
                            type="tel"
                            id="expiry"
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength={5} // MM/AA = 5 caracteres
                            placeholder="MM/AA"
                            required
                        />
                    </div>

                    {/* CAMPO CVV */}
                    <div>
                        <label htmlFor="cvv">CVV</label>
                        <input
                            type="tel"
                            id="cvv"
                            value={cvv}
                            onChange={handleCvvChange}
                            maxLength={3} // Limita a 3 dígitos
                            placeholder="123"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="pay-btn">Pagar e Finalizar Pedido</button>
            </form>
        </div>
    );
};