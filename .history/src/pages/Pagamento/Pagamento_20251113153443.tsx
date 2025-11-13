import { useState } from 'react';
import './Pagamento.css';

export const Pagamento = () => {
    // Definindo o estado para os dados do cartão
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    
    // Supondo um estado mock para o carrinho/resumo
    const totalAmount = 20.00;
    const mockCartItems = [
        { name: 'Ingresso Inteira (1x)', price: 20.00 },
    ];
    // Estados para os Dados do Cliente, agora editáveis
    const [userEmail, setUserEmail] = useState('seu.email@exemplo.com'); 
    const [userName, setUserName] = useState('Nome do Cliente'); 

    // 4.1. Nome do Cartão: Apenas maiúsculas
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
        // O regex /(\d{4})(?=\d)/g captura 4 dígitos e insere um espaço, desde que haja mais dígitos à frente.
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
        
        // Removendo espaços/barras para validação final
        const rawCardNumber = cardNumber.replace(/\s/g, '');
        const rawExpiry = expiry.replace(/\//g, '');
        
        // Validação dos Dados do Cliente (agora editáveis)
        if (userName.trim().length === 0 || userEmail.trim().length === 0) {
            console.error('Por favor, preencha todos os seus dados.');
            alert('Por favor, preencha todos os seus dados.');
            return;
        }

        if (cardName.trim().length === 0) {
            console.error('Por favor, preencha o nome no cartão.');
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

        console.log('Dados do pagamento válidos:', { userName, userEmail, cardName, cardNumber, expiry, cvv });
        alert('Pagamento Submetido com Sucesso!'); 
    };

    return (
        <div className="payment-container">
            <div className="payment-form-side">
                <form onSubmit={handlePaymentSubmit} className="payment-form">
                    
                    {/* SEUS DADOS (Agora Editáveis) */}
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
                                    /* REMOVIDO: disabled */ 
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
                                    /* REMOVIDO: disabled */ 
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* INFORMAÇÕES DE PAGAMENTO */}
                    <fieldset>
                        <legend>2. Informações de Pagamento (Cartão)</legend>

                        {/* CAMPO NOME DO CARTÃO */}
                        <label htmlFor="cardName">Nome no Cartão</label>
                        <input
                            type="text"
                            id="cardName"
                            value={cardName}
                            onChange={handleCardNameChange}
                            placeholder="NOME COMPLETO"
                            required
                            maxLength={50}
                            style={{ textTransform: 'uppercase' }} 
                        />

                        {/* CAMPO NÚMERO DO CARTÃO */}
                        <label htmlFor="cardNumber">Número do Cartão</label>
                        <input
                            type="tel" 
                            id="cardNumber"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19} // 16 dígitos + 3 espaços = 19
                            placeholder="0000 0000 0000 0000"
                            required
                        />

                        <div className="form-row">
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
                    </fieldset>

                    <button type="submit" className="payment-submit-btn">Finalizar Pagamento (R$ {totalAmount.toFixed(2)})</button>
                </form>
            </div>
            
            {/* RESUMO DO PEDIDO */}
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