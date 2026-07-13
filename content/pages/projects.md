---
canonicalUrl: 'https://bradystroud.dev/projects'
title: Projects | Brady Stroud
description: A selection of practical products, open-source projects, and personal tools built by software engineer Brady Stroud.
blocks:
  - eyebrow: Selected work
    heading: Useful things, built for fun (and sometimes to solve real problems).
    introduction: >-
      A mix of products, open-source projects, and small tools I built because I
      wanted them to exist.
    items:
      - category: Web product
        title: ParmiPicks
        description: >-
          A guide to finding a genuinely good chicken parmi, with reviews,
          ratings, and recommendations. Built with a visual CMS so the content
          stays as enjoyable to manage as it is to browse.
        note: Live and serving parmi enthusiasts.
        technologies:
          - Next.js
          - TinaCMS
          - Tailwind CSS
        links:
          - label: Visit ParmiPicks
            url: 'https://parmipicks.com'
          - label: View source
            url: 'https://github.com/bradystroud/ParmiPicks'
      - category: Menu bar utility
        title: SolarBar
        description: >-
          Live GoodWe solar production, grid flow, and daily cost estimates in
          the macOS menu bar. It talks directly to the inverter over the local
          network using Modbus TCP, with no cloud in the middle.
        note: Built for the solar setup at home.
        technologies:
          - Python
          - rumps
          - Modbus TCP
        links:
          - label: View source
            url: 'https://github.com/bradystroud/solarbar'
      - category: Menu bar app
        title: AirTouchBar
        description: >-
          Local control for a Polyaire AirTouch 2+ ducted air conditioner from
          macOS. It talks directly to the wall console over raw TCP, including
          power, modes, fan speed, setpoint, zones, and damper positions.
        note: Verified against a real five-zone system.
        technologies:
          - Swift
          - SwiftUI
          - TCP
        links:
          - label: View source
            url: 'https://github.com/bradystroud/airtouch-mac'
          - label: Read the story
            url: 'https://bradystroud.dev/blogs/airtouch-homekit'
      - category: iPad app
        title: Glance
        description: >-
          An always-on iPad dashboard that rotates through on-device photos,
          weather, Hacker News, developer videos, and open GitHub pull requests.
          Everything runs on-device with no backend.
        technologies:
          - Swift
          - SwiftUI
          - iPadOS
        links:
          - label: View project
            url: 'https://bradystroud.github.io/glance/'
          - label: View source
            url: 'https://github.com/bradystroud/glance'
      - category: Open source
        title: MAUI + Blazor Solution Template
        description: >-
          A pragmatic starting point for apps that share Razor UI across web,
          mobile, and desktop, backed by a separate ASP.NET Core Web API and a
          generated typed client.
        note: Used by developers around the world, with more than 60 GitHub stars.
        technologies:
          - .NET 10
          - MAUI
          - Blazor
          - ASP.NET Core
        links:
          - label: View source
            url: 'https://github.com/bradystroud/MauiBlazorTemplate'
          - label: Read the article
            url: 'https://bradystroud.dev/blogs/maui-blazor'
      - category: Developer tool
        title: Localhost HQ
        description: >-
          A macOS menu bar app that reveals every local TCP listener, names the
          page running on each port, filters background noise, spots conflicts,
          and makes forgotten development servers easy to find.
        technologies:
          - Swift
          - SwiftUI
          - macOS
        links:
          - label: View project
            url: 'https://bradystroud.github.io/localhost-hq/'
          - label: View source
            url: 'https://github.com/bradystroud/localhost-hq'
    _template: projectsShowcase
---
