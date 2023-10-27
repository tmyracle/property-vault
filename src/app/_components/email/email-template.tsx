import * as React from "react";
import { Button } from "@react-email/button";

interface EmailTemplateProps {
  slug: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  slug,
}) => (
  <div>
    <h1>You have a new disbursement request for review</h1>
    <Button
      href={`http://localhost:3000/disbursements?id=${slug}`}
      style={{ color: "#61dafb", padding: "10px 20px" }}
    >
      View Request
    </Button>
  </div>
);
