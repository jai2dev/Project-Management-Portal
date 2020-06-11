import React from "react";
import MentorProfile from "./MentorProfile";
import ApplicantProfile from "./ApplicantProfile";
import SuperAdminProfile from "./SuperAdminProfile";
import OrgAdminProfile from "./OrgAdminProfile";

export default function Profile({ user }) {
  function Display(type) {
    switch (type) {
      case "applicant":
        return <ApplicantProfile />;
      case "mentor":
        return <MentorProfile />;
      case "orgAdmin":
        return <OrgAdminProfile />;
      case "superAdmin":
        return <SuperAdminProfile />;
      default:
        return null;
    }
  }

  return <div key={user.id}> {Display(user.type)}</div>;
}
