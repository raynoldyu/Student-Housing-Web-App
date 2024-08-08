import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

function ImageGallery({ images }) {
  console.log(images)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '55%', padding: '10px' }}>
      {images.length > 0 ? (
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index} style={{height: '100%'}}>
                <img
                  style={{ height: '400px', width: '650px', objectFit: 'cover'}}
                  src={image.image}
                  alt={`Slide ${index}`}
                />
            </Carousel.Item>

          ))}
        </Carousel>
      ) : (
          <img style={{height: '100%', width: '80%', objectFit: 'cover'}} src={'https://raw.githubusercontent.com/julien-gargot/images-placeholder/master/placeholder-landscape.png'} alt="Placeholder" />
      )
      }
    </div >
  );
}

export default ImageGallery;