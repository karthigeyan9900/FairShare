import { useState, useEffect } from 'react';
import type { Group, Collection } from './types/app';
import GroupSetup from './components/GroupSetup';
import LockerManager from './components/LockerManager';
import ExpensesList from './components/ExpensesList';
import SummaryDashboard from './components/SummaryDashboard';
import Login from './components/Login';
import GroupIconEditor from './components/GroupIconEditor';
import CollectionsList from './components/CollectionsList';
import CreateCollection from './components/CreateCollection';
import CollectionDashboard from './components/CollectionDashboard';
import CurrencyRatesDisplay from './components/CurrencyRatesDisplay';
import GroupCurrencyEditor from './components/GroupCurrencyEditor';

function AppNew() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'locker' | 'summary'>('expenses');
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  
  // Collections state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'groups' | 'collections'>('groups');
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  const activeGroup = groups.find(g => g.id === activeGroupId) || null;
  const activeCollection = collections.find(c => c.id === activeCollectionId) || null;

  // Get storage keys for current user
  const getUserStorageKey = (key: string) => currentUser ? `${currentUser}_${key}` : key;

  // Load current user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Get list of existing users
  const getExistingUsers = (): string[] => {
    const users: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('_expenseGroups')) {
        const username = key.replace('_expenseGroups', '');
        if (username && !users.includes(username)) {
          users.push(username);
        }
      }
    }
    return users.sort();
  };

  const handleLogin = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setCurrentUser(null);
      setGroups([]);
      setActiveGroupId(null);
      localStorage.removeItem('currentUser');
    }
  };

  // Load from localStorage when user changes
  useEffect(() => {
    if (!currentUser) return;

    // Load groups
    let saved = localStorage.getItem(getUserStorageKey('expenseGroups'));
    const savedActiveId = localStorage.getItem(getUserStorageKey('activeGroupId'));
    
    // Migration: Check for old single-group format
    if (!saved) {
      const oldGroup = localStorage.getItem(getUserStorageKey('expenseGroup'));
      if (oldGroup) {
        console.log('Migrating old data to new multi-group format...');
        const parsedOldGroup = JSON.parse(oldGroup);
        // Wrap old group in array format
        saved = JSON.stringify([parsedOldGroup]);
        localStorage.setItem(getUserStorageKey('expenseGroups'), saved);
        localStorage.removeItem(getUserStorageKey('expenseGroup')); // Clean up old key
      }
    }
    
    if (saved) {
      const loadedGroups = JSON.parse(saved);
      // Migration: Add currency field to groups that don't have it
      const migratedGroups = loadedGroups.map((g: Group) => ({
        ...g,
        currency: g.currency || 'USD' // Default to USD if no currency
      }));
      setGroups(migratedGroups);
      if (savedActiveId && migratedGroups.find((g: Group) => g.id === savedActiveId)) {
        setActiveGroupId(savedActiveId);
      } else if (migratedGroups.length > 0) {
        setActiveGroupId(migratedGroups[0].id);
      }
    } else {
      setGroups([]);
      setActiveGroupId(null);
    }

    // Load collections
    const savedCollections = localStorage.getItem(getUserStorageKey('collections'));
    const savedActiveCollectionId = localStorage.getItem(getUserStorageKey('activeCollectionId'));
    const savedViewMode = localStorage.getItem(getUserStorageKey('viewMode'));
    
    if (savedCollections) {
      const loadedCollections = JSON.parse(savedCollections);
      setCollections(loadedCollections);
      if (savedActiveCollectionId && loadedCollections.find((c: Collection) => c.id === savedActiveCollectionId)) {
        setActiveCollectionId(savedActiveCollectionId);
      }
    } else {
      setCollections([]);
      setActiveCollectionId(null);
    }

    if (savedViewMode === 'collections' || savedViewMode === 'groups') {
      setViewMode(savedViewMode);
    }
  }, [currentUser]);

  // Save groups to localStorage
  useEffect(() => {
    if (!currentUser) return;

    if (groups.length > 0) {
      localStorage.setItem(getUserStorageKey('expenseGroups'), JSON.stringify(groups));
    }
    if (activeGroupId) {
      localStorage.setItem(getUserStorageKey('activeGroupId'), activeGroupId);
    }
  }, [groups, activeGroupId, currentUser]);

  // Save collections to localStorage
  useEffect(() => {
    if (!currentUser) return;

    if (collections.length > 0) {
      localStorage.setItem(getUserStorageKey('collections'), JSON.stringify(collections));
    }
    if (activeCollectionId) {
      localStorage.setItem(getUserStorageKey('activeCollectionId'), activeCollectionId);
    }
    localStorage.setItem(getUserStorageKey('viewMode'), viewMode);
  }, [collections, activeCollectionId, viewMode, currentUser]);

  const handleGroupCreated = (newGroup: Group) => {
    setGroups([...groups, newGroup]);
    setActiveGroupId(newGroup.id);
  };

  const handleGroupUpdate = (updatedGroup: Group) => {
    setGroups(groups.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const switchGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setShowGroupSelector(false);
  };

  const deleteGroup = (groupId: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    
    // Clean up collections: remove this group from all collections
    const updatedCollections = collections.map(collection => ({
      ...collection,
      groupIds: collection.groupIds.filter(id => id !== groupId),
      updatedAt: new Date()
    })).filter(collection => collection.groupIds.length > 0); // Remove empty collections
    
    setCollections(updatedCollections);
    
    if (activeGroupId === groupId) {
      setActiveGroupId(updatedGroups.length > 0 ? updatedGroups[0].id : null);
    }
  };

  const resetGroup = () => {
    if (confirm('Are you sure you want to delete this group? All data will be lost.')) {
      if (activeGroupId) {
        deleteGroup(activeGroupId);
      }
    }
  };

  // Collection CRUD handlers
  const handleCreateCollection = (newCollection: Collection) => {
    setCollections([...collections, newCollection]);
    setActiveCollectionId(newCollection.id);
    setViewMode('collections');
  };

  const handleUpdateCollection = (updatedCollection: Collection) => {
    setCollections(collections.map(c => 
      c.id === updatedCollection.id ? updatedCollection : c
    ));
  };

  const handleDeleteCollection = (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection? Groups will not be deleted.')) return;
    
    const updatedCollections = collections.filter(c => c.id !== collectionId);
    setCollections(updatedCollections);
    
    if (activeCollectionId === collectionId) {
      setActiveCollectionId(updatedCollections.length > 0 ? updatedCollections[0].id : null);
    }
  };

  // Navigation handlers
  const switchToCollectionsView = () => {
    setViewMode('collections');
    setActiveTab('expenses'); // Reset tab when switching views
  };

  const switchToGroupsView = () => {
    setViewMode('groups');
  };

  const openCollection = (collectionId: string) => {
    setActiveCollectionId(collectionId);
    setViewMode('collections');
  };

  const openGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setViewMode('groups');
    setShowGroupSelector(false);
  };

  const exportData = () => {
    if (!activeGroup) return;
    
    const dataStr = JSON.stringify(activeGroup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeGroup.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Group;
        // Add imported group to the list
        const newGroup = { ...imported, id: Date.now().toString() };
        setGroups([...groups, newGroup]);
        setActiveGroupId(newGroup.id);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  // Show login if no user is logged in
  if (!currentUser) {
    return <Login onLogin={handleLogin} existingUsers={getExistingUsers()} />;
  }

  if (!activeGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">💰</span>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">FairShare</h1>
                <p className="text-sm text-gray-500">Expense Tracker</p>
              </div>
            </div>
          </div>

          {/* Existing Groups Section */}
          {groups.length > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Already part of a group?</h3>
                    <p className="text-sm text-gray-500">Select from your existing groups</p>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {groups.map(g => (
                    <button
                      key={g.id}
                      onClick={() => setActiveGroupId(g.id)}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all border border-purple-200 hover:border-purple-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {g.icon ? (
                            <span className="text-2xl">{g.icon}</span>
                          ) : (
                            g.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 group-hover:text-purple-700">{g.name}</p>
                          <p className="text-sm text-gray-500">{g.members.length} members • {g.expenses.length} expenses</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-purple-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGroup(g.id);
                          }}
                          className="text-red-400 hover:text-red-600 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete group"
                        >
                          🗑️
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="text-center my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500 font-medium">OR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Import Data Section */}
          <div className="mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-3xl">📂</span>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Have existing data?</p>
                  <p className="text-xs text-blue-700">Import your previously saved group</p>
                </div>
              </div>
              <label className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-all shadow-md hover:shadow-lg">
                Import File
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Create New Group Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">➕</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Create New Group</h3>
                <p className="text-sm text-gray-500">Start tracking expenses with a new group</p>
              </div>
            </div>
            <GroupSetup onGroupCreated={handleGroupCreated} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 text-white flex flex-col shadow-2xl">
        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">💰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FairShare</h1>
              <p className="text-sm text-purple-200">Expense Tracker</p>
            </div>
          </div>
        </div>

        {/* Group Selector */}
        <div className="px-6 pb-4">
          <button
            onClick={() => setShowGroupSelector(!showGroupSelector)}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <p className="text-sm font-semibold">{activeGroup.name}</p>
                <p className="text-xs text-purple-200">{groups.length} group{groups.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <span className={`text-lg transition-transform ${showGroupSelector ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Group Dropdown */}
          {showGroupSelector && (
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 space-y-2 max-h-64 overflow-y-auto">
              {groups.map(g => (
                <div
                  key={g.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    g.id === activeGroupId
                      ? 'bg-white text-purple-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => switchGroup(g.id)}
                    className="flex-1 text-left font-medium flex items-center gap-2"
                  >
                    {g.icon && <span className="text-lg">{g.icon}</span>}
                    <span>{g.name}</span>
                  </button>
                  {g.id !== activeGroupId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(g.id);
                      }}
                      className="ml-2 text-red-300 hover:text-red-100 text-sm"
                      title="Delete group"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setActiveGroupId(null);
                  setShowGroupSelector(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-white font-medium transition-all"
              >
                <span className="text-lg">➕</span>
                <span>Create New Group</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 space-y-3">
          <button
            onClick={switchToCollectionsView}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${
              viewMode === 'collections'
                ? 'bg-white text-purple-600 shadow-xl'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-2xl">📊</span>
            <span className="text-base">Collections</span>
            {collections.length > 0 && (
              <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {collections.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${
              activeTab === 'summary' && viewMode === 'groups'
                ? 'bg-white text-purple-600 shadow-xl'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-2xl">📈</span>
            <span className="text-base">Dashboard</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('expenses');
              setViewMode('groups');
            }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${
              activeTab === 'expenses' && viewMode === 'groups'
                ? 'bg-white text-purple-600 shadow-xl'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-2xl">📝</span>
            <span className="text-base">Expenses</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('locker');
              setViewMode('groups');
            }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${
              activeTab === 'locker' && viewMode === 'groups'
                ? 'bg-white text-purple-600 shadow-xl'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-2xl">🔒</span>
            <span className="text-base">Cash Locker</span>
          </button>
        </nav>

        {/* User Info */}
        <div className="px-6 pb-4 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold">
                {currentUser.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{currentUser}</p>
                <p className="text-xs text-purple-200">Logged in</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-medium"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-3 border-t border-white/10">
          <button
            onClick={exportData}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium backdrop-blur-sm"
          >
            <span className="text-lg">💾</span>
            <span>Export Data</span>
          </button>
          <label className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-sm font-medium cursor-pointer backdrop-blur-sm">
            <span className="text-lg">📂</span>
            <span>Import Data</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
          <button
            onClick={resetGroup}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-red-200 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <span className="text-lg">🔄</span>
            <span>Reset Group</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-10 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{activeGroup.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{activeGroup.members.length} members in this group</p>
            </div>
            <div className="flex items-center gap-4">
              <GroupCurrencyEditor group={activeGroup} onUpdate={handleGroupUpdate} />
              <GroupIconEditor group={activeGroup} onUpdate={handleGroupUpdate} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-10 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Currency Rates Display */}
          <CurrencyRatesDisplay />
          
          {viewMode === 'groups' && (
            <>
              {activeTab === 'expenses' && (
                <ExpensesList group={activeGroup} onUpdate={handleGroupUpdate} />
              )}
              {activeTab === 'locker' && (
                <LockerManager group={activeGroup} onUpdate={handleGroupUpdate} />
              )}
              {activeTab === 'summary' && (
                <SummaryDashboard group={activeGroup} />
              )}
            </>
          )}
          {viewMode === 'collections' && !activeCollectionId && (
            <CollectionsList
              collections={collections}
              groups={groups}
              onSelectCollection={openCollection}
              onCreateCollection={() => setShowCreateCollection(true)}
              onDeleteCollection={handleDeleteCollection}
            />
          )}
          {viewMode === 'collections' && activeCollectionId && activeCollection && (
            <CollectionDashboard
              collection={activeCollection}
              groups={groups}
              onNavigateToGroup={openGroup}
              onEditCollection={() => setShowCreateCollection(true)}
              onBack={() => setActiveCollectionId(null)}
            />
          )}
        </main>
      </div>

      {/* Create/Edit Collection Modal */}
      {showCreateCollection && (
        <CreateCollection
          groups={groups}
          existingCollection={activeCollectionId && activeCollection ? activeCollection : undefined}
          onSave={(collection) => {
            if (activeCollectionId) {
              handleUpdateCollection(collection);
            } else {
              handleCreateCollection(collection);
            }
            setShowCreateCollection(false);
          }}
          onCancel={() => setShowCreateCollection(false)}
        />
      )}
    </div>
  );
}

export default AppNew;
