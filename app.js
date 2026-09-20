import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView, StatusBar, Alert, Modal, Image } from 'react-native';

const SERVERS = [
  { n: 'ألمانيا', c: 'DE', f: '🇩🇪', ip: '1.1.1.1' }, { n: 'فرنسا', c: 'FR', f: '🇫🇷', ip: '2.2.2.2' },
  { n: 'أمريكا', c: 'US', f: '🇺🇸', ip: '3.3.3.3' }, { n: 'الإمارات', c: 'UAE', f: '🇦🇪', ip: '4.4.4.4' }, { n: 'اليابان', c: 'JP', f: '🇯🇵', ip: '5.5.5.5' }
];

export default function App() {
  const [tab, setTab] = useState('home'); const [status, setStatus] = useState('disconnected');
  const [sIdx, setSIdx] = useState(0); const [sni, setSni] = useState('://whatsapp.com'); const [port, setPort] = useState('443');
  const [timeLeft, setTimeLeft] = useState(1800); const [showSSL, setShowSSL] = useState(false);
  const [sslConfig, setSslConfig] = useState({ spoofSni: false, trueSsl: true, spoofHostPort: true });
  const timerRef = useRef(null);

  useEffect(() => {
    if (status === 'connected') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current); setStatus('disconnected'); return 1800; }
          return prev - 1;
        });
      }, 1000);
    } else { if (timerRef.current) clearInterval(timerRef.current); setTimeLeft(1800); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status]);

  const formatTime = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
  const theme = { bg: '#0A0E1A', card: '#161B2E', txt: '#F8FAFC', border: '#232A42' };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>BLS Tunnels Pro</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}>
        {tab === 'home' && (
          <View>
            <Text style={styles.sub}>Next-Gen Premium VPN Tunnel</Text>
            
            {/* إضافة صورتك هنا لتظهر كشعار أنيق في واجهة التطبيق الرئيسية */}
            <Image 
              source={require('./تنزيل.jpeg')} 
              style={styles.appLogo} 
            />

            <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.statBox}><Text style={[styles.statVal, { color: status === 'connected' ? '#00D9A3' : '#94A3B8' }]}>{formatTime(timeLeft)}</Text><Text style={styles.statLbl}>الوقت المتبقي ⏱️</Text></View>
            </View>
            <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => setTab('servers')}>
              <Text style={styles.val}>{SERVERS[sIdx].f} {SERVERS[sIdx].n} ({SERVERS[sIdx].c})</Text><Text style={styles.lbl}>موقع النفق 🌐</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.card, { backgroundColor: theme.card, borderColor: '#00D9A3' }]} onPress={() => setShowSSL(true)}>
              <Text style={[styles.val, { color: '#00D9A3' }]}>{port} : {sni}</Text><Text style={styles.lbl}>إعدادات SSL المتقدمة ⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.connBtn, status === 'connected' ? styles.bOn : status === 'connecting' ? styles.bWait : styles.bOff]} onPress={() => setStatus(status === 'disconnected' ? 'connected' : 'disconnected')}>
              <Text style={styles.connText}>{status === 'disconnected' ? "إبدأ الاتصال اللامحدود" : "إيقاف النفق الحقيقي"}</Text>
            </TouchableOpacity>
          </View>
        )}
        {tab === 'servers' && (
          <View>{SERVERS.map((srv, idx) => (
            <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: theme.card, borderColor: idx === sIdx ? '#00D9A3' : theme.border }]} onPress={() => { setSIdx(idx); setTab('home'); }}>
              <Text style={{ color: '#00D9A3', fontWeight: 'bold' }}>{srv.c}</Text><Text style={styles.val}>{srv.f} {srv.n}</Text>
            </TouchableOpacity>))}</View>
        )}
      </ScrollView>
      <Modal visible={showSSL} transparent animationType="fade"><View style={styles.modalOverlay}><View style={styles.modalCard}>
        <Text style={styles.modalTitle}>Advanced SSL Settings</Text>
        <View style={styles.row}><Text style={styles.popTxt}>Spoof SNI Host</Text><Switch value={sslConfig.spoofSni} onValueChange={() => setSslConfig({...sslConfig, spoofSni: !sslConfig.spoofSni})} /></View>
        <View style={styles.row}><Text style={styles.popTxt}>True SSL (Anti DPI)</Text><Switch value={sslConfig.trueSsl} onValueChange={() => setSslConfig({...sslConfig, trueSsl: !sslConfig.trueSsl})} /></View>
        <View style={styles.row}><Text style={styles.popTxt}>Spoof Host:Port</Text><Switch value={sslConfig.spoofHostPort} onValueChange={() => setSslConfig({...sslConfig, spoofHostPort: !sslConfig.spoofHostPort})} /></View>
        <View style={styles.inputGroup}><Text style={styles.inputLbl}>Spoof Host</Text><TextInput style={styles.popInput} value={sni} onChangeText={setSni} /></View>
        <View style={styles.inputGroup}><Text style={styles.inputLbl}>Spoof Port</Text><TextInput style={styles.popInput} value={port} onChangeText={setPort} keyboardType="numeric" /></View>
        <View style={styles.btnRow}><TouchableOpacity onPress={() => setShowSSL(false)}><Text style={styles.btnTxt}>CANCEL</Text></TouchableOpacity><TouchableOpacity onPress={() => setShowSSL(false)}><Text style={[styles.btnTxt, { color: '#00D9A3' }]}>OK</Text></TouchableOpacity></View>
      </View></View></Modal>
      <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTab('servers')}><Text style={{ color: tab === 'servers' ? '#00D9A3' : '#64748B' }}>🌐 الخوادم</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setTab('home')}><Text style={{ color: tab === 'home' ? '#00D9A3' : '#64748B' }}>🏠 الرئيسية</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 45 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#00D9A3' },
  sub: { fontSize: 12, textAlign: 'center', marginBottom: 15, color: '#94A3B8' },
  card: { padding: 14, borderRadius: 12, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1 },
  lbl: { fontSize: 11, color: '#94A3B8' }, val: { fontSize: 14, fontWeight: 'bold', color: '#F8FAFC' },
  connBtn: { padding: 16, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginTop: 15, width: '85%', alignSelf: 'center' },
  bOff: { backgroundColor: '#1E253B' }, bWait: { backgroundColor: '#B45309' }, bOn: { backgroundColor: '#00D9A3' }, connText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 55, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1 },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 }, statsRow: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 15 },
  statBox: { alignItems: 'center' }, statVal: { fontSize: 22, fontWeight: 'bold' }, statLbl: { fontSize: 11, color: '#94A3B8', marginTop: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#FFFFFF', width: '85%', borderRadius: 8, padding: 20 }, modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }, popTxt: { fontSize: 14, color: '#333' },
  inputGroup: { borderBottomWidth: 1, borderBottomColor: '#CCC', marginVertical: 6, paddingVertical: 2 }, inputLbl: { fontSize: 11, color: '#666' },
  popInput: { fontSize: 15, color: '#000', paddingVertical: 2 }, btnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 25, marginTop: 20 }, btnTxt: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  appLogo: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', marginBottom: 20, resizeMode: 'cover' }
});
