// Sistema para sincronizar estado entre pestañas/navegadores
class TabSyncManager {
  private channel: BroadcastChannel | null = null
  private tabId: string
  private isLeader = false
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("geekwear_sync")
      this.setupChannelListeners()
      this.electLeader()
    }
  }

  private setupChannelListeners() {
    if (!this.channel) return

    this.channel.addEventListener("message", (event) => {
      const { type, data, fromTab } = event.data

      // Ignorar mensajes de la misma pestaña
      if (fromTab === this.tabId) return

      switch (type) {
        case "LEADER_ELECTION":
          this.handleLeaderElection(data)
          break
        case "CART_UPDATE":
          this.handleCartSync(data)
          break
        case "AUTH_UPDATE":
          this.handleAuthSync(data)
          break
        case "STORAGE_CONFLICT":
          this.handleStorageConflict(data)
          break
      }
    })
  }

  private electLeader() {
    // Intentar ser líder
    const leaderKey = "geekwear_tab_leader"
    const currentLeader = localStorage.getItem(leaderKey)

    if (!currentLeader || this.isLeaderExpired(currentLeader)) {
      this.becomeLeader()
    } else {
      this.isLeader = false
    }

    // Verificar liderazgo cada 5 segundos
    this.heartbeatInterval = setInterval(() => {
      this.checkLeadership()
    }, 5000)
  }

  private becomeLeader() {
    this.isLeader = true
    const leaderData = {
      tabId: this.tabId,
      timestamp: Date.now(),
    }
    localStorage.setItem("geekwear_tab_leader", JSON.stringify(leaderData))
    console.log(`🏆 Pestaña ${this.tabId} es ahora líder`)

    this.broadcast("LEADER_ELECTION", { newLeader: this.tabId })
  }

  private isLeaderExpired(leaderData: string): boolean {
    try {
      const data = JSON.parse(leaderData)
      return Date.now() - data.timestamp > 10000 // 10 segundos
    } catch {
      return true
    }
  }

  private checkLeadership() {
    const leaderKey = "geekwear_tab_leader"
    const currentLeader = localStorage.getItem(leaderKey)

    if (this.isLeader) {
      // Actualizar timestamp si somos líderes
      const leaderData = {
        tabId: this.tabId,
        timestamp: Date.now(),
      }
      localStorage.setItem(leaderKey, JSON.stringify(leaderData))
    } else if (!currentLeader || this.isLeaderExpired(currentLeader)) {
      // Intentar ser líder si no hay uno activo
      this.becomeLeader()
    }
  }

  private handleLeaderElection(data: any) {
    if (data.newLeader !== this.tabId) {
      this.isLeader = false
    }
  }

  private handleCartSync(data: any) {
    // Solo sincronizar si no somos líderes
    if (!this.isLeader) {
      console.log("🛒 Sincronizando carrito desde otra pestaña")
      // Actualizar el carrito sin disparar eventos
      this.updateCartSilently(data)
    }
  }

  private handleAuthSync(data: any) {
    if (!this.isLeader) {
      console.log("🔐 Sincronizando auth desde otra pestaña")
      // Recargar la página para sincronizar auth
      window.location.reload()
    }
  }

  private handleStorageConflict(data: any) {
    console.warn("⚠️ Conflicto de almacenamiento detectado:", data)
    if (!this.isLeader) {
      // Esperar un poco y recargar
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  private updateCartSilently(cartData: any) {
    // Actualizar localStorage sin disparar eventos de Zustand
    try {
      localStorage.setItem("geekwear-cart", JSON.stringify(cartData))
    } catch (error) {
      console.error("Error actualizando carrito:", error)
    }
  }

  public broadcast(type: string, data: any) {
    if (this.channel) {
      this.channel.postMessage({
        type,
        data,
        fromTab: this.tabId,
        timestamp: Date.now(),
      })
    }
  }

  public syncCart(cartData: any) {
    if (this.isLeader) {
      this.broadcast("CART_UPDATE", cartData)
    }
  }

  public syncAuth(authData: any) {
    if (this.isLeader) {
      this.broadcast("AUTH_UPDATE", authData)
    }
  }

  public reportStorageConflict(details: any) {
    this.broadcast("STORAGE_CONFLICT", details)
  }

  public cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    if (this.channel) {
      this.channel.close()
    }

    // Limpiar liderazgo si somos líderes
    if (this.isLeader) {
      localStorage.removeItem("geekwear_tab_leader")
    }
  }

  public getTabId() {
    return this.tabId
  }

  public getIsLeader() {
    return this.isLeader
  }
}

export const tabSync = new TabSyncManager()

// Limpiar al cerrar la pestaña
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    tabSync.cleanup()
  })
}
