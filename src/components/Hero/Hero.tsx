import './Hero.css'

import heroBackgroundImage from '../../assets/Hero/teatro.jpg'

import { Link } from 'react-router-dom'

export const Hero = () => {
    return (
        <section className="hero-container" style={{ backgroundImage: `url(${heroBackgroundImage})` }}>
            <div className="hero-content">
                <h1>MUSEU DE MANAUS</h1>
                <Link to="/ingressos" className="hero-btn">
                    INGRESSOS
                </Link>
            </div>

        </section>
    )
}