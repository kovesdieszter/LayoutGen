import "../design/Header.css";

export default function Header({ requestCode, id }) {
  return (
    <>
      <div className="header">
        <p className="flexItem">SL - 2024</p>
        <p className="flexItem">jn id: {id}</p>
        <p className="flexItem">code: {requestCode}</p>
      </div>
    </>
  );
}
