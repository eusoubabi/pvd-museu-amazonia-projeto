
import './home.css';

// 1. Importar os componentes que criamos
import { Hero } from '../../components/Hero/Hero';
import { FeaturedExhibitions } from '../../components/FeaturedExhibitions/FeaturedExhibitions';
import { MainExhibitions } from '../../components/MainExhibitions/MainExhibitions';
import { WeeklySchedule } from '../../components/WeeklySchedule/WeeklySchedule';

export const Home = () => {
  return (
    //hero e main ficam fora da div, por terem imagem de fundo
    <main>
      <Hero />

      <FeaturedExhibitions />

      {/* As outra seções ficam dentro por terem o mesmo fundo, sendo apenas centralizado na tela */}
      <div className="home-content-wrapper">
        <MainExhibitions />

        <WeeklySchedule />
        
      </div>
    </main>
  );
}