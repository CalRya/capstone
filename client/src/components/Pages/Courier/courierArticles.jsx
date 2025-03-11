import CourierCRUDArticles from '../../Courier/CourierPage';
import NavbarCourier from '../../Navbar/NavbarCourier';

function Courier() {

  return (
    <main className="App">
        <NavbarCourier/>
      <CourierCRUDArticles />
    </main>
  );
}

export default Courier;