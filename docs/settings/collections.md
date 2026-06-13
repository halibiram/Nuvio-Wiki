## Nuvio Collections

>[!CAUTION]
>Creating collections should be considered an advanced user feature (seriously this is a warning). If you do not consider yourself an advanced user it is recommend to copy one from [nuvio's community collections](https://nuvio.tv/community-collections)

### Nuvio Collection Structures

Nuvio collections can be confusing. At its core though, it is a file system with folders and subfolders and files in those subfolders (catalogs). Below is a diagram to illustrate this.

### Simplified Catalog Structure

```mermaid
graph LR
    MainCatalog[🎬 Action Catalog *on home screen*] --> Folder1[📁 2020s Action Movies *inside of Action Catalog*]
    MainCatalog --> Folder2[📁 2010s Action Movies *inside of Action Catalog*]

    Folder1 --> Movies2020[📄 List of 2020s Movies *catalog for list*]
    Folder2 --> Movies2010[📄 List of 2010s Movies *catalog for list*]
    
    %% Styling
    classDef category fill:#2a2a2a,stroke:#333,stroke-width:2px,color:#fff
    classDef folder fill:#005f73,stroke:#001219,stroke-width:2px,color:#fff
    classDef list fill:#0a9396,stroke:#001219,stroke-width:2px,color:#fff

    class MainCatalog category
    class Folder1,Folder2 folder
    class Movies2020,Movies2010 list
