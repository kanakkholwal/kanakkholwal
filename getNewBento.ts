const apiUrl = "https://opbento.edgexhq.tech/api/bento?n=Kanak%20Kholwal&g=kanakkholwal&x=kanakkholwal&l=kanak-kholwal&i=https%3A%2F%2Fgithub.com%2Fkanakkholwal.png&p=https%3A%2F%2Fkanakkholwal.eu.org&z=794c3";
interface BentoResponse {
  url: string;
}

const fetchBentoUrl = async (apiUrl: string): Promise<string> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: BentoResponse = (await response.json()) as BentoResponse;
    return data.url;
  } catch (error) {
    console.error("Error fetching Bento URL:", error);
    throw error;
  }
};

// @ts-ignore
fetchBentoUrl(apiUrl);
