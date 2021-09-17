<script lang="ts">
//components
import CredentialSubjectFieldSelector from "../CredentialSubjectFieldSelector.svelte";
import Button from "../ui/Button.svelte";
import CredentialCard from "../cards/CredentialCard.svelte";
//stores
import { slideOverContent } from "../../stores/ui";
import { credentials } from "../../stores/credentials";
//utils
import inputDescriptionBuilder from "../../utils/frameBuilder";
//api
import { deriveCredential, getAllCredentials } from "../../api/credentials";

export let selectedSchemaFields: string[] = [];
export let verifiableCredential: object;

const handleDeriveCredential = async () => {
  const frame = inputDescriptionBuilder(
    selectedSchemaFields,
    verifiableCredential["credentialSubject"]
  );
  const derived = await deriveCredential(verifiableCredential, {
    "@context": verifiableCredential["@context"],
    type: verifiableCredential["type"],
    credentialSubject: frame,
  });
  slideOverContent.set({
    title: "Derived Credential",
    component: CredentialCard,
    credential: derived,
  });
  const resp = await getAllCredentials();
  if (resp) {
    credentials.set(resp);
  }
};
</script>

<CredentialSubjectFieldSelector
  credentialSubject="{verifiableCredential['credentialSubject']}"
  bind:selected="{selectedSchemaFields}" />
<Button
  additionalClasses="mt-6"
  callback="{handleDeriveCredential}"
  label="Derive" />
