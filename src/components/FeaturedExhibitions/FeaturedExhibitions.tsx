import './FeaturedExhibitions.css';

//importação das imagens definindo seus "apelidos"
import imgCores from '../../assets/FeaturedExhibitions/img-cores.jpg';
import imgManaus from '../../assets/FeaturedExhibitions/img-manaus.jpg';
import imgIndigena from '../../assets/FeaturedExhibitions/img-arte-indigena.jpg';
import imgSom from '../../assets/FeaturedExhibitions/img-som.jpg';

//Dados que vão vir do back dps
const featuredData = [
    { id: 1, title: 'Cores da Amazônia', image: imgCores },
    { id: 2, title: 'Manaus Antiga', image: imgManaus },
    { id: 3, title: 'Arte Indígena', image: imgIndigena },
    { id: 4, title: 'Som da Floresta', image: imgSom },
];

export const FeaturedExhibitions = () => {
    return (
        <section className="featured-section">
            <div className="featured-grid">
                {featuredData.map(item => (
                    <div 
                        className="featured-card"
                        key={item.id}
                        style={{ backgroundImage:`url(${item.image})`}}
                    >
                        <div className="card-overlay">
                            <span className="card-title">{item.title}</span>
                        </div>    
                    </div>
                ))}
            </div>
        </section>
    );
};
