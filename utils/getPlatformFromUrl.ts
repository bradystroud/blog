export function getPlatformFromUrl(url: string): string {
    try {
        // Create a new URL object
        const urlObj = new URL(url);

        // Get the hostname
        const hostname = urlObj.hostname;

        // Extract the second-level domain (SLD)
        const domainParts = hostname.split(".");
        const platformName = domainParts.slice(-2, -1)[0];

        return platformName.charAt(0).toUpperCase() + platformName.slice(1);
    } catch (error) {
        if (url === "") {
            return "Empty social item";
        }

        console.error("Invalid URL", error);

        return "Error parsing URL";
    }
}