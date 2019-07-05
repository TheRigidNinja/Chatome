import React from "react";

function ProfileManager() {
  return (
    <>
      {/* User Email */}
      <div className="Person">
        <div className="details">
          <h4>Email</h4>
          <p>------------</p>
        </div>
        <i class="fas fa-pen"/>
      </div>

      {/* User Phone number */}
      <div className="Person">
        <div className="details">
          <h4>Phone</h4>
          <p>------------</p>
        </div>
        <i class="fas fa-pen"/>
      </div>

      {/* Your Gender */}
      <div className="Person">
        <div className="details">
          <h4>Gender</h4>
          <p>-------</p>
        </div>
        <i class="fas fa-pen"/>
      </div>

      {/* Age */}
      <div className="Person">
        <div className="details">
          <h4>Your Age</h4>
          <p>--</p>
        </div>
        <i class="fas fa-pen"/>
      </div>

      {/* Allow Calls */}
      <div className="Person">
        <div className="details">
          <h4>Allow Calls</h4>
          <p>Yes</p>
        </div>
        <i class="fas fa-pen"/>
      </div>

      {/* Make Profile Public */}
      <div className="Person">
        <div className="details">
          <h4>Make Profile Public</h4>
          <p>Yes</p>
        </div>
        <i class="fas fa-pen"/>
      </div>
    </>
  );
}

export default ProfileManager;
