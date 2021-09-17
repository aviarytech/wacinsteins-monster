<style lang="postcss">
</style>

<script lang="ts">
//api
import { getContacts, postNewContact } from "../api/contactsAxios";
//stores
import { availableContacts, contactDropDownOptions } from "../stores/contacts";
//ecma
import {
  IsFQDN,
  IsString,
  IsNotEmpty,
  validateSync,
  validateOrReject,
} from "class-validator";
import swal from "sweetalert";
import { useNavigate } from "svelte-navigator";

//INFO: realy cool way to use opp to validate entries
class ValidContact {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsFQDN()
  url: string;

  error: boolean = false;

  constructor(message: string[]) {
    this.type = message[0];
    this.url = message[1];
    this.validate();
  }
  protected validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      console.log("incorrect contact generated: ", errors);
      swal(
        "Incorrect Entry",
        "Please ensure the domain name is valid",
        "error"
      );
    } else {
      console.log("validation succeed");
      swal(
        "Success",
        `New contact from domain: ${this.url} has been added`,
        "success"
      ).then(async () => {
        const res = await getContacts();
        availableContacts.set(res);
      });
    }
  }

  generatePayload() {
    return { did: `did:${this.type}:${this.url}` };
  }
}

async function validateOrRejectEntry(input) {
  try {
    await validateOrReject(input);
    //if correct we make the post call
    postNewContact(input.generatePayload());
  } catch (errors) {
    console.log(
      "Caught promise rejection (validation failed). Errors: ",
      errors
    );
  }
}

let localVal: string[] = ["web", ""];
function newContactValidator() {
  let payload = new ValidContact(localVal);
  //check class validator for domain only names
  validateOrRejectEntry(payload);
}
</script>

<template>
  <div class=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="../favicon.ico" alt="Av1 icon" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Add a New Contact
        </h2>
      </div>
      <form
        class="mt-8 space-y-6"
        on:submit|preventDefault="{newContactValidator}">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <select
              bind:value="{localVal[0]}"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
              <!-- BUG: not assignign the proper value-->
              {#each $contactDropDownOptions as item}
                <option value="{item}">
                  {item}
                </option>
              {/each}
            </select>
          </div>
          <div>
            <label for="url" class="sr-only">Url</label>
            <input
              id="url"
              name="url"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Domain"
              bind:value="{localVal[1]}" />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span
              class="absolute left-0 inset-y-0 flex items-center pl-3 stroke-current text-white">
              <img src="./assets/icons/user-add.svg" class="icon md" alt="" />
            </span>
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
