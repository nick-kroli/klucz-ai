import React from 'react'

const HomePage = ({onLogOut}) => {

  const handleLogOut = () => {
    onLogOut();
  }


  return(
  <div>
    <h1>
      WITAM W KLUCZ AI
    </h1>
    <form>
      <div className="form-actions">
        <button type="button" onClick={handleLogOut}>Log out</button>
      </div>
    </form>
  </div>
  );
};


export default HomePage;