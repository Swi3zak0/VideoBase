import React from 'react';
import '../CSS/Styles.css';

function Home() {
  return (
    <>
      <div className="home-container">
        <div className="right-container">
          <h2>Popular</h2>
          <ul>
            <li>Kanał 1</li>
            <li>Kanał 2</li>
            <li>Kanał 3</li>
          </ul>
        </div>
        <div className="main-content">
          <h2>Wideo</h2>
          <div className="video">
            <p>Video1</p>
          </div>
        </div>
        <div className='left-container'>
        </div>
      </div>
    </>
  );
}

export default Home;
