
  import "./ThreatDetails.css";

  type ThreatDetailsProps = {
    threat: any;
    goToBack: () => void;
  };

  export function ThreatDetails({ threat, goToBack }: ThreatDetailsProps){
    return (
      <div>
        <div>
          <a href="#" onClick={goToBack} className="breadcrumb-link">
            Документы / <span>{threat.name}</span>
          </a>
        </div>

        <div className="cards">
          <h1>{threat.name}</h1>
          <img
            src={threat.image}
            alt={threat.title}
            style={{ width: "300px", borderRadius: "10px" }}
          />
          <p>{threat.description}</p>
        </div>
      </div>
    );
  }