# Cada Gaucho

## A privacy-preserving sybil-resistant solution for Buenos Aires citizens to sign petitions

1. User Logs In:
   User signs in to your webapp via Privy/Gmail.

2. Prompt to Install QuarkID:
   If QuarkID app isn't installed, prompt user to download it.

3. Generate User’s DID in QuarkID App:
   User registers/signs in with QuarkID and obtains a DID.

4. Request a Verifiable Credential (VC) via Extrimian SSI APIs:
   Backend calls Extrimian’s WACI/OOB API with developer’s DID and desired credential subject.
   Receives oobContentData for QR code generation.

5. Generate and Display QR Code:
   Convert oobContentData into a QR code using a QR code library.
   Display the QR code in the frontend for the user to scan.

6. User Scans QR Code with QuarkID:
   User scans the QR code using QuarkID app, initiating credential sharing.

7. Backend Verification via QuarkID and Extrimian:
   QuarkID and Extrimian verify the user's Buenos Aires citizenship.
   Backend receives confirmation (e.g., boolean or verifiable presentation).

8. Generate Zero-Knowledge Proof:
   Derive Nullifier:
   From the user's DID and petition ID, generate a deterministic nullifier.
   Generate ZK Proof:
   Use Circom and SnarkJS to create a ZK proof that:
   The user possesses a valid VC proving Buenos Aires citizenship.
   The nullifier is correctly derived and unique for the specific petition.
   Tools:
   Circom: For defining and compiling the ZK circuit.
   SnarkJS: For generating and verifying proofs.

9. Submit Proof to Smart Contract:
   User submits the ZK proof and nullifier to your smart contract on Sepolia.
   The contract verifies the proof and ensures the nullifier hasn't been used before.

10. Smart Contract Actions:
    Upon successful verification, mark the nullifier as used.
    Allow the user to perform the desired action (e.g., signing the petition).
