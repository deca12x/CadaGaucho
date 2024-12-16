import { EXTRIMIAN_CONFIG } from "./config";

interface PresentationRequest {
  did: string;
  to: string;
  inputDescriptors: {
    id: string;
    constraints: {
      fields: Array<{
        path: string[];
        id: string;
        purpose: string;
        filter: {
          type: string;
          const: any;
        };
      }>;
    };
    name: string;
    purpose: string;
    format: {
      jwt?: { alg: string[] };
      jwt_vc?: { alg: string[] };
      jwt_vp?: { alg: string[] };
      ldp_vc?: { proof_type: string[] };
      ldp_vp?: { proof_type: string[] };
      ldp?: { proof_type: string[] };
    };
  };
  frame: {
    "@context": string[];
    type: string[];
    credentialSubject: {
      "@explicit": boolean;
      type: string[];
    };
  };
}

interface PresentationResponse {
  oobContentData: string;
  invitationId: string;
}

interface DIDResolutionResponse {
  "@context": string[];
  id: string;
  verificationMethod: Array<{
    id: string;
    controller: string;
    type: string;
    publicKeyJwk: {
      kty: string;
      crv: string;
      x: string;
      y: string;
    };
  }>;
  keyAgreement: string[];
  authentication: string[];
  service: Array<any>;
}

interface CreateDIDRequest {
  websocket: string;
  dwn: string;
  webhookURL: string;
  verificationRulesEndpoint: string;
  integrationServiceEndpoint: string;
  didMethod: string;
}

interface CreateDIDResponse {
  did: string;
}

interface VerificationRequest {
  did: string; // Your developer DID
  type: string; // Type of verification we want
}

interface VerificationResponse {
  qrData: string; // Data to show in QR code
  sessionId: string; // To check verification status
}

export class ExtrimianAPI {
  private static async makeRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT",
    body?: any
  ) {
    const url = `/api/extrimian${endpoint}`;
    console.log("Making request to:", url);
    console.log("Request body:", body);

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        mode: "cors",
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  static async requestPresentation(
    verifierDID: string
  ): Promise<PresentationResponse> {
    const params: PresentationRequest = {
      did: verifierDID,
      to: "",
      inputDescriptors: {
        id: "residency_check",
        name: "Buenos Aires Residency Check",
        purpose: "Verify Buenos Aires residency",
        constraints: {
          fields: [
            {
              path: ["$.type"],
              id: "type",
              purpose: "Check credential type",
              filter: {
                type: "string",
                const: "BuenosAiresCredential",
              },
            },
          ],
        },
        format: {
          jwt_vc: { alg: ["ES256K"] },
        },
      },
      frame: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiablePresentation"],
        credentialSubject: {
          "@explicit": true,
          type: ["BuenosAiresCredential"],
        },
      },
    };

    return await this.makeRequest(
      "/v1/credentialsbbs/waci/oob/presentation",
      "PUT",
      params
    );
  }

  static async resolveDID(did: string): Promise<DIDResolutionResponse> {
    const endpoint = `/v1/dids/quarkid/${did}`;
    return await this.makeRequest(endpoint, "GET");
  }

  static async testDIDCreation() {
    try {
      console.log("Testing DID resolution...");
      const response = await this.resolveDID(EXTRIMIAN_CONFIG.developerDid!);
      console.log("DID Resolution Success:", response);
      return response;
    } catch (error) {
      console.error("DID Resolution Failed:", error);
      throw error;
    }
  }

  static async createDID(): Promise<CreateDIDResponse> {
    const params = {
      websocket: "https://sandbox-ssi-ws.extrimian.com",
      didMethod: "did:quarkid",
    };

    return await this.makeRequest("/did", "PUT", params);
  }

  static async requestVerification(): Promise<VerificationResponse> {
    const params: VerificationRequest = {
      did: EXTRIMIAN_CONFIG.developerDid!,
      type: "BuenosAiresCredential",
    };

    return await this.makeRequest("/v1/verification/request", "POST", params);
  }
}
