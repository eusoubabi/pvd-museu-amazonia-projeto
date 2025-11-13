import './MainExhibitions.css';

import imgPintura from '../../assets/MainExhibitions/img-pintura.jpg';
import imgArtes from '../../assets/MainExhibitions/img-artes-indigenas.jpg';
import imgHistoria from '../../assets/MainExhibitions/img-historia-manaus.jpg';
import imgFoto from '../../assets/MainExhibitions/img-fotografia-arte-rua.jpg';

//dados do back
const featuredData = [
    {id: 1, title: "PINTURA & ESCULTURA", image: imgPintura},
    {id: 2, title: "ARTES INDIGENAS", image: imgArtes},
    {id: 3, title: "HISTÓRIA DE MANAUS", image: imgHistoria},
    {id: 4, title: "FOTOGRAFIA & ARTE DE RUA", image: imgFoto},
]

export const MainExhibitions = () => {
    return (
        <section className="main-exhibitions-section">
            {/*titulo em cima dos cartões */}
            <h2 className="section-title">Exposições em destaque</h2>
            {/* cartões */}
            <div className="main-exhibitions-grid">
                {featuredData.map(item => (
                    <div className="main-card" key={item.id}>
                        <img src={item.image} alt={item.title} className="main-card-bg" />
                        <div className="main-card-overlay">
                            <h3>{item.title}</h3>
                        </div>
                    </div>

                ))}
            </div>
        </section>
    );
};