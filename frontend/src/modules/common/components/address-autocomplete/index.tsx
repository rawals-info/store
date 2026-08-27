import React, { useEffect, useRef, useState } from "react"
import Input from "@modules/common/components/input"

// Extend the Window interface so TS knows about the injected Google script
declare global {
  interface Window {
    google: any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

interface PlaceDetails {
  address_1: string
  city: string
  province: string
  postal_code: string
  country_code: string
}

interface AddressAutocompleteProps {
  label?: string
  value: string
  name?: string
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelect: (details: PlaceDetails) => void
}

/**
 * AddressAutocomplete
 * --------------------
 * A thin wrapper around the Google Places `Autocomplete` widget that renders
 * our existing `Input` component but, once a suggestion is chosen, parses the
 * returned `place.address_components` object and emits the structured parts
 * needed by the checkout form (address line, city, province, pin code, etc.).
 *
 * NOTE: This component only restricts suggestions to India (ISO-2: "in").
 *
 * The Google Maps script is loaded dynamically the first time the component
 * mounts so there is no need to add the `<script>` tag globally.
 */
const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label = "Address",
  value,
  name,
  required = false,
  onChange,
  onSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)

  // Dynamically inject the Google Maps JS script (if not already present)
  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.google && window.google.maps && window.google.maps.places) {
      setScriptLoaded(true)
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    )

    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true))
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.addEventListener("load", () => setScriptLoaded(true))
    document.body.appendChild(script)
  }, [])

  // Initialise the Autocomplete widget once the script is ready
  useEffect(() => {
    if (!scriptLoaded || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["address_components", "formatted_address", "place_id"],
        types: ["address"],
        componentRestrictions: { country: "in" },
      }
    )

    // Prevent form submission on Enter key
    const input = inputRef.current
    const preventSubmit = (e: KeyboardEvent) => {
      if (e.key === "Enter" && document.querySelector(".pac-container:not(.pac-hidden)")) {
        e.preventDefault()
      }
    }
    input.addEventListener("keydown", preventSubmit)

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      
      // If no address components, the user might have just pressed Enter without selecting
      if (!place.address_components) {
        return
      }

      const components = place.address_components as Array<any> // eslint-disable-line @typescript-eslint/no-explicit-any

      const get = (types: string[]): string => {
        const comp = components.find((c: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
          types.some((t) => c.types.includes(t))
        )
        return comp ? comp.long_name : ""
      }

      const postal_code = get(["postal_code"])
      const city =
        get(["locality"]) ||
        get(["sublocality", "sublocality_level_1"]) ||
        get(["administrative_area_level_2"])
      const province = get(["administrative_area_level_1"])
      const country = get(["country"])
      const street_number = get(["street_number"])
      const route = get(["route"])
      const sublocality = get([
        "sublocality_level_3",
        "sublocality_level_2",
        "sublocality_level_1",
      ])

      let address_1 = ""
      if (street_number || route) {
        address_1 = `${street_number} ${route}`.trim()
      } else {
        address_1 = place.formatted_address || ""
      }

      if (sublocality) {
        address_1 = `${address_1}, ${sublocality}`
      }

      const emitDetails = (d: Partial<PlaceDetails>) => {
        const merged = {
          address_1,
          city,
          province,
          postal_code,
          country_code: country ? country.toLowerCase() : "",
          ...d,
        } as PlaceDetails
        
        // Immediately trigger onChange to sync the input value with React state
        if (inputRef.current && onChange) {
          const syntheticEvent = {
            target: {
              name: name ?? "",
              value: merged.address_1,
            },
          } as React.ChangeEvent<HTMLInputElement>
          onChange(syntheticEvent)
        }
        
        // Call onSelect with all the address details
        onSelect(merged)
      }

      // If postal code is present, emit immediately
      if (postal_code) {
        emitDetails({})
      } else if (window.google?.maps?.Geocoder) {
        // If postal code missing, run an extra reverse-geocode to try and fetch it
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ placeId: place.place_id }, (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const comps = results[0].address_components as Array<any>
            const pcComp = comps.find((c: any) => c.types.includes("postal_code"))
            const stateComp = comps.find((c: any) => c.types.includes("administrative_area_level_1"))
            const cityComp = comps.find((c: any) =>
              ["locality", "administrative_area_level_2", "administrative_area_level_3"].some((t) => c.types.includes(t))
            )
            emitDetails({
              postal_code: pcComp ? pcComp.long_name : postal_code,
              province: stateComp ? stateComp.long_name : province,
              city: cityComp ? cityComp.long_name : city,
            })
          } else {
            // Even if geocoding fails, emit what we have
            emitDetails({})
          }
        })
      } else {
        // No geocoder available, emit what we have
        emitDetails({})
      }
    })

    return () => {
      // Cleanup listeners when component unmounts
      input.removeEventListener("keydown", preventSubmit)
      autocomplete.unbindAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded])

  return (
    <Input
      label={label}
      name={name ?? ""}
      autoComplete="address-line1"
      value={value}
      onChange={onChange}
      ref={inputRef}
      required={required}
      data-testid="address-autocomplete-input"
    />
  )
}

export default AddressAutocomplete 